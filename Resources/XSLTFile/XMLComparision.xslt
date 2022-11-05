<xsl:stylesheet   exclude-result-prefixes="def lang odm xlink xsi html" version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:lang="en" xmlns:def="http://www.cdisc.org/ns/def/v2.0" xmlns:odm="http://www.cdisc.org/ns/odm/v1.3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
 
  <xsl:output method="html"  indent="yes"/>

  <xsl:template match="/">   
   
    
    <xsl:variable name="pathref" select="odm:ODM/@RefreshXmlPath "/>
    <xsl:variable name="updatedXML" select="document($pathref)"/>
    
    <xmlcompare>

      <xsl:variable name="updated" select="$updatedXML/odm:ODM/odm:Study/odm:MetaDataVersion/."/>

      <xsl:variable name="old" select="odm:ODM/odm:Study/odm:MetaDataVersion/."/>
      	<xsl:variable name="MDOID" select="$updatedXML/odm:ODM/odm:Study/odm:MetaDataVersion/@OID"/>
      <xsl:variable name="MDElementID" select="$old/@ElementID"/>
   
   	<!-- ValueListDef Starts -->
      <!--Update ValueListDef Attributes-->
			<xsl:for-each select="$updated/def:ValueListDef">
				<xsl:variable name="uVLOID" select="@OID"/>				
				<xsl:for-each select="odm:ItemRef">					
					<xsl:variable name="uVLIRItemOID" select="@ItemOID"/>
					<xsl:for-each select="@*">
						<xsl:variable name="UpdatedXMLValue" select="current()"/>
						<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
						<xsl:for-each select="$old/def:ValueListDef">
							<xsl:variable name="oVLOID" select="@OID"/>
							<xsl:if test="$uVLOID=$oVLOID">
								<xsl:for-each select="odm:ItemRef">									
									<xsl:variable name="oVLIRItemOID" select="@ItemOID"/>
									<xsl:variable name="oVLIRElementID" select="@ElementID"/>
									<xsl:variable name="oVLIRTableID" select="@TableID"/>
									<xsl:variable name="oVLIRXpath" select="@Xpath"/>
									<xsl:if test="$uVLIRItemOID=$oVLIRItemOID">
										<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

										<xsl:if test="$uVLIRItemOID!='' and $oVLIRItemOID!=''">
											<xsl:for-each select="@*">
												<xsl:variable name="OldXMLValue" select="current()"/>
												<xsl:variable name="OldXMLAttribute" select="name()"/>

												<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
													<!--Do the logic here-->

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
														<!--Update-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Update'"/>
															<xsl:with-param name="TableID" select="$oVLIRTableID"/>
															<xsl:with-param name="ElementID" select="$oVLIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="$oVLIRXpath"/>
															<xsl:with-param name="OID" select="$uVLIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$oVLOID"/>
														</xsl:call-template>
													</xsl:if>

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
														<!--Create-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Create'"/>
															<xsl:with-param name="TableID" select="$oVLIRTableID"/>
															<xsl:with-param name="ElementID" select="$oVLIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="$oVLIRXpath"/>
															<xsl:with-param name="OID" select="$uVLIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$oVLOID"/>                            
														</xsl:call-template>
													</xsl:if>
													<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
														<!--Delete-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Delete'"/>
															<xsl:with-param name="TableID" select="$oVLIRTableID"/>
															<xsl:with-param name="ElementID" select="$oVLIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="$oVLIRXpath"/>
															<xsl:with-param name="OID" select="$uVLIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$oVLOID"/>
														</xsl:call-template>
													</xsl:if>
												</xsl:if>
											</xsl:for-each>
										</xsl:if>
									</xsl:if>
								</xsl:for-each>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>

			<!-- Delete Element - ValueListDef/ItemRef -->
			<xsl:variable name="var" select="$updated/def:ValueListDef/odm:ItemRef"/>
			<xsl:for-each select="$old/def:ValueListDef[@OID=$var/../@OID]/odm:ItemRef[not(@ItemOID = $var/@ItemOID)] ">
				<xsl:variable name="pOID_delVL" select="../@OID"/>				
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oVLIRItemOID" select="@ItemOID"/>
				<xsl:variable name="oVLIRElementID" select="@ElementID"/>
				<xsl:variable name="oVLIRTableID" select="@TableID"/>
				<xsl:variable name="oVLIRXpath" select="@Xpath"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oVLIRTableID"/>
					<xsl:with-param name="ElementID" select="$oVLIRElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oVLIRXpath"/>
					<xsl:with-param name="OID" select="@ItemOID"/>
					<xsl:with-param name="ParentOID" select="$pOID_delVL"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - ValueListDef/ItemRef -->
			<xsl:variable name="oldVLIR" select="$old/def:ValueListDef/odm:ItemRef"/>
			<xsl:for-each select="$updated/def:ValueListDef[@OID=$oldVLIR/../@OID]/odm:ItemRef[not(@ItemOID = $oldVLIR/@ItemOID)] ">
				<xsl:variable name="pOID_creVL" select="../@OID"/>
        
        <xsl:variable name="oTableVLIR" select="$oldVLIR[../@OID=$pOID_creVL]/../@TableID"/>
				<xsl:variable name="oElementVLIR" select="$oldVLIR[../@OID=$pOID_creVL]/../@ElementID"/>
				<xsl:variable name="oXpathVLIR" select="$oldVLIR[../@OID=$pOID_creVL]/../@Xpath"/>			

				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableVLIR"/>
					<xsl:with-param name="ElementID" select="$oElementVLIR"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ValueListDef&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathVLIR"/>
					<xsl:with-param name="OID" select="@ItemOID"/>
					<xsl:with-param name="ParentOID" select="$pOID_creVL"/>
         <xsl:with-param name="OrderNumber" select="3"/>
				</xsl:call-template>
			</xsl:for-each>

			<!-- Delete Element - ValueListDef -->
			<xsl:variable name="newVL" select="$updated/def:ValueListDef"/>
			<xsl:for-each select="$old/def:ValueListDef[not(@OID = $newVL/@OID)] ">				

				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oVLItemOID" select="@OID"/>
				<xsl:variable name="oVLElementID" select="@ElementID"/>
				<xsl:variable name="oVLTableID" select="@TableID"/>
				<xsl:variable name="oVLXpath" select="@Xpath"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oVLTableID"/>
					<xsl:with-param name="ElementID" select="$oVLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ValueListDef&quot;"/>
					<xsl:with-param name="Xpath" select="$oVLXpath"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
				</xsl:call-template>
			</xsl:for-each>

			<!-- Create Element - ValueListDef -->
			<xsl:variable name="oldVL" select="$old/def:ValueListDef"/>
			<xsl:for-each select="$updated/def:ValueListDef[not(@OID = $oldVL/@OID)] ">
         <xsl:variable name="oTableVL" select="$oldVL/@TableID"/>
				<xsl:variable name="oElementVL" select="$oldVL/@ElementID"/>
				<xsl:variable name="oXpathVL" select="$oldVL/@Xpath"/>

				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableVL"/>
					<xsl:with-param name="ElementID" select="$MDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathVL"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
         <xsl:with-param name="OrderNumber" select="3"/>
				</xsl:call-template>
			</xsl:for-each>
      
       <!-- Delete Element - def:ValueListDef/ItemRef/WhereClauseRef -->
			<xsl:variable name="updatedIGDIRWCR" select="$updated/def:ValueListDef/odm:ItemRef/def:WhereClauseRef"/>
			<xsl:for-each select="$old/def:ValueListDef[@OID=$updatedIGDIRWCR/../../@OID]/odm:ItemRef[@ItemOID=$updatedIGDIRWCR/../@ItemOID]/def:WhereClauseRef[not(@WhereClauseOID = $updatedIGDIRWCR/@WhereClauseOID)] ">
        <xsl:variable name="pOID_delIRWCR" select="../../@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oIGDIRWCROID" select="@WhereClauseOID"/>
				<xsl:variable name="oIGDIRWCRElementID" select="@ElementID"/>
				<xsl:variable name="oIGDIRWCRTableID" select="@TableID"/>
				<xsl:variable name="oIGDIRWCRXpath" select="@Xpath"/>  
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oIGDIRWCRTableID"/>
					<xsl:with-param name="ElementID" select="$oIGDIRWCRElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oIGDIRWCRXpath"/>
					<xsl:with-param name="OID" select="$oIGDIRWCROID"/>
					<xsl:with-param name="ParentOID" select="$pOID_delIRWCR"/>
				</xsl:call-template>
			</xsl:for-each>
       
			<!-- Create Element - def:ValueListDef/ItemRef/WhereClauseRef -->
			<xsl:variable name="oldIGDIRWCR" select="$old/def:ValueListDef/odm:ItemRef/def:WhereClauseRef"/> 
			<xsl:for-each select="$updated/def:ValueListDef[@OID=$oldIGDIRWCR/../../@OID]/odm:ItemRef[@ItemOID=$oldIGDIRWCR/../@ItemOID]/def:WhereClauseRef[not(@WhereClauseOID = $oldIGDIRWCR/@WhereClauseOID)]">
				<xsl:variable name="pOID_creIR" select="../@ItemOID"/>     
        
         
        <xsl:variable name="oTableIGDIRWCR" select="$oldIGDIRWCR[../@ItemOID=$pOID_creIR]/@TableID"/>
        <xsl:variable name="oElementIGDIRWCR" select="$oldIGDIRWCR[../@ItemOID=$pOID_creIR]/@ElementID"/>
        <xsl:variable name="oXpathIGDIRWCR" select="$oldIGDIRWCR[../@ItemOID=$pOID_creIR]/@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableIGDIRWCR"/>
					<xsl:with-param name="ElementID" select="$oElementIGDIRWCR"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathIGDIRWCR"/>
					<xsl:with-param name="OID" select="@WhereClauseOID"/>
					<xsl:with-param name="ParentOID" select="$pOID_creIR"/>
         <xsl:with-param name="OrderNumber" select="3"/>
				</xsl:call-template>
			</xsl:for-each>
       
			<!-- ValueListDef Ends -->      

    	<!-- ItemGroupDef Starts-->
      <!-- Delete Element - ItemGroupDef -->
      <xsl:variable name="updatedIGD" select="$updated/odm:ItemGroupDef"/>
      <xsl:for-each select="$old/odm:ItemGroupDef[not(@OID = $updatedIGD/@OID)] ">
        <xsl:variable name="OldXMLAttribute" select="name()"/>
        <xsl:variable name="oIGDOID" select="@OID"/>
        <xsl:variable name="oIGDElementID" select="@ElementID"/>
        <xsl:variable name="oIGDTableID" select="@TableID"/>
        <xsl:variable name="oIGDXpath" select="@Xpath"/>
        <xsl:call-template name="UpdateXPTRefresh">
          <xsl:with-param name="Action" select="'Delete'"/>
          <xsl:with-param name="TableID" select="$oIGDTableID"/>
          <xsl:with-param name="ElementID" select="$oIGDElementID"/>
          <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
          <xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
          <xsl:with-param name="AttributeValue" select="''"/>
          <xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
          <xsl:with-param name="Xpath" select="$oIGDXpath"/>
          <xsl:with-param name="OID" select="@OID"/>
          <xsl:with-param name="ParentOID" select="$MDOID"/>
        </xsl:call-template>
      </xsl:for-each>

      <!-- Create Element - ItemGroupDef -->
      <xsl:variable name="oldIGD" select="$old/odm:ItemGroupDef"/>
      <xsl:for-each select="$updated/odm:ItemGroupDef[not(@OID = $oldIGD/@OID)] ">
        <xsl:variable name="oTableIGD" select="$oldIGD/@TableID"/>
        <xsl:variable name="oElementIGD" select="$oldIGD/@ElementID"/>
        <xsl:variable name="oXpathIGD" select="$oldIGD/@Xpath"/>

        <xsl:variable name="UpdatedXMLAttribute" select="name()"/>
        <xsl:call-template name="UpdateXPTRefresh">
          <xsl:with-param name="Action" select="'Create'"/>
          <xsl:with-param name="TableID" select="$oTableIGD"/>
          <xsl:with-param name="ElementID" select="$MDElementID"/>
          <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
          <xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
          <xsl:with-param name="AttributeValue" select="''"/>
          <xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
          <xsl:with-param name="Xpath" select="$oXpathIGD"/>
          <xsl:with-param name="OID" select="@OID"/>
          <xsl:with-param name="ParentOID" select="$MDOID"/>
        <xsl:with-param name="OrderNumber" select="6"/>
        </xsl:call-template>
      </xsl:for-each>

      <!-- Delete Element - ItemGroupDef/ItemRef -->
      <xsl:variable name="updatedIGDIR" select="$updated/odm:ItemGroupDef/odm:ItemRef"/>
      
      <xsl:for-each select="$old/odm:ItemGroupDef[@OID=$updatedIGDIR/../@OID]/odm:ItemRef[not(@ItemOID = $updatedIGDIR/@ItemOID)] ">
        <xsl:variable name="pOID_delIR" select="../@OID"/>
        <xsl:variable name="OldXMLAttribute" select="name()"/>
        <xsl:variable name="oIGDIRItemOID" select="@ItemOID"/>
        <xsl:variable name="oIGDIRElementID" select="@ElementID"/>
        <xsl:variable name="oIGDIRTableID" select="@TableID"/>
        <xsl:variable name="oIGDIRXpath" select="@Xpath"/>
        <xsl:call-template name="UpdateXPTRefresh">
          <xsl:with-param name="Action" select="'Delete'"/>
          <xsl:with-param name="TableID" select="$oIGDIRTableID"/>
          <xsl:with-param name="ElementID" select="$oIGDIRElementID"/>
          <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
          <xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
          <xsl:with-param name="AttributeValue" select="''"/>
          <xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
          <xsl:with-param name="Xpath" select="$oIGDIRXpath"/>
          <xsl:with-param name="OID" select="$oIGDIRItemOID"/>
          <xsl:with-param name="ParentOID" select="$pOID_delIR"/>
        </xsl:call-template>
      </xsl:for-each>
      
			<!-- Create Element - ItemGroupDef/ItemRef -->
      <xsl:variable name="oldIGDIR" select="$old/odm:ItemGroupDef/odm:ItemRef"/>
      <xsl:for-each select="$updated/odm:ItemGroupDef[@OID=$oldIGDIR/../@OID]/odm:ItemRef[not(@ItemOID = $oldIGDIR/@ItemOID)] ">
        <xsl:variable name="pOID_creIR" select="../@OID"/>
        <xsl:variable name ="pelementID"> 
          <xsl:value-of select ="$oldIGDIR[../@OID=$pOID_creIR]/../@ElementID"/>        
        </xsl:variable>
        
        <xsl:variable name="oTableIGDIR" select="$oldIGDIR[../@OID=$pOID_creIR]/../@TableID"/>       
        <xsl:variable name="oXpathIGDIR" select="$oldIGDIR[../@OID=$pOID_creIR]/../@Xpath"/>
       
        <xsl:variable name="UpdatedXMLAttribute" select="name()"/>
        <xsl:call-template name="UpdateXPTRefresh">
          <xsl:with-param name="Action" select="'Create'"/>
          <xsl:with-param name="TableID" select="$oTableIGDIR"/>
          <xsl:with-param name="ElementID" select="$pelementID"/>
          <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
          <xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
          <xsl:with-param name="AttributeValue" select="''"/>
          <xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
          <xsl:with-param name="Xpath" select="$oXpathIGDIR"/>
          <xsl:with-param name="OID" select="@ItemOID"/>
          <xsl:with-param name="ParentOID" select="$pOID_creIR"/>
        <xsl:with-param name="OrderNumber" select="6"/>
        </xsl:call-template>
      </xsl:for-each>

      <!-- Delete Element - ItemGroupDef/def:leaf -->
			<xsl:variable name="updatedIGDDefleaf" select="$updated/odm:ItemGroupDef/def:leaf"/>
			<xsl:for-each select="$old/odm:ItemGroupDef[@OID=$updatedIGDDefleaf/../@OID]/def:leaf[not(@ID = $updatedIGDDefleaf/@ID)] ">
				<xsl:variable name="oIGDOID" select="../@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oIGDDLItemOID" select="@ItemOID"/>
				<xsl:variable name="oIGDDLElementID" select="@ElementID"/>
				<xsl:variable name="oIGDDLTableID" select="@TableID"/>
				<xsl:variable name="oIGDDLXpath" select="@Xpath"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oIGDDLTableID"/>
					<xsl:with-param name="ElementID" select="$oIGDDLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oIGDDLXpath"/>
					<xsl:with-param name="OID" select="$oIGDDLItemOID"/>
					<xsl:with-param name="ParentOID" select="$oIGDOID"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - ItemGroupDef/def:leaf -->
			<xsl:variable name="oldIGDDefLeaf" select="$old/odm:ItemGroupDef/def:leaf"/>
			<xsl:for-each select="$updated/odm:ItemGroupDef[@OID=$oldIGDDefLeaf/../@OID]/def:leaf[not(@ID = $oldIGDDefLeaf/@ID)] ">
				<xsl:variable name="IGDOID" select="../@OID"/>
        
         <xsl:variable name="oTableIGDDL" select="$oldIGDDefLeaf[../@OID=$IGDOID]/@TableID"/>
				<xsl:variable name="oElementIGDDL" select="$oldIGDDefLeaf[../@OID=$IGDOID]/@ElementID"/>
				<xsl:variable name="oXpathIGDDL" select="$oldIGDDefLeaf[../@OID=$IGDOID]/@Xpath"/>
			
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableIGDDL"/>
					<xsl:with-param name="ElementID" select="$oElementIGDDL"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathIGDDL"/>
					<xsl:with-param name="OID" select="@ID"/>
					<xsl:with-param name="ParentOID" select="$IGDOID"/>
        <xsl:with-param name="OrderNumber" select="6"/>
				</xsl:call-template>
			</xsl:for-each>
      
      <!--Update ItenGroupDef Attributes-->
			<xsl:for-each select="$updated/odm:ItemGroupDef">

				<xsl:variable name="uIGDOID" select="@OID"/>

				<xsl:for-each select="@*">
					<xsl:variable name="UpdatedXMLValue" select="current()"/>
					<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

					<xsl:for-each select="$old/odm:ItemGroupDef">
						<xsl:variable name="oIGDOID" select="@OID"/>
						<xsl:variable name="oIGDElementID" select="@ElementID"/>
						<xsl:if test="$uIGDOID=$oIGDOID">

							<xsl:variable name="oIGDTableID" select="@TableID"/>
							<xsl:variable name="oIGDXpath" select="@Xpath"/>

							<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

							<xsl:for-each select="@*">
								<xsl:variable name="OldXMLValue" select="current()"/>
								<xsl:variable name="OldXMLAttribute" select="name()"/>

								<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
									<!--Do the logic here-->

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
										<!--Update-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Update'"/>
											<xsl:with-param name="TableID" select="$oIGDTableID"/>
											<xsl:with-param name="ElementID" select="$oIGDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
											<xsl:with-param name="Xpath" select="$oIGDXpath"/>
											<xsl:with-param name="OID" select="$uIGDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
										<!--Create-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Create'"/>
											<xsl:with-param name="TableID" select="$oIGDTableID"/>
											<xsl:with-param name="ElementID" select="$oIGDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
											<xsl:with-param name="Xpath" select="$oIGDXpath"/>
											<xsl:with-param name="OID" select="$uIGDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
										<!--Delete-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Delete'"/>
											<xsl:with-param name="TableID" select="$oIGDTableID"/>
											<xsl:with-param name="ElementID" select="$oIGDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
											<xsl:with-param name="Xpath" select="$oIGDXpath"/>
											<xsl:with-param name="OID" select="$uIGDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>

			<!--Update ItemGroupDef/ItemRef Attributes-->
			<xsl:for-each select="$updated/odm:ItemGroupDef">
				<xsl:variable name="uIGDOID" select="@OID"/>
				<xsl:for-each select="odm:ItemRef">
					<xsl:variable name="uIGDIRItemOID" select="@ItemOID"/>
					<xsl:for-each select="@*">
						<xsl:variable name="UpdatedXMLValue" select="current()"/>
						<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
						<xsl:for-each select="$old/odm:ItemGroupDef">
							<xsl:variable name="oIGDOID" select="@OID"/>
							<xsl:variable name="oIGDElementID" select="@ElementID"/>
							<xsl:if test="$uIGDOID=$oIGDOID">
								<xsl:for-each select="odm:ItemRef">

									<xsl:variable name="oIGDIRItemOID" select="@ItemOID"/>
									<xsl:variable name="oIGDIRElementID" select="@ElementID"/>
									<xsl:variable name="oIGDIRTableID" select="@TableID"/>
									<xsl:variable name="oIGDIRXpath" select="@Xpath"/>
									<xsl:if test="$uIGDIRItemOID=$oIGDIRItemOID">
										<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

										<xsl:if test="$uIGDIRItemOID!='' and $oIGDIRItemOID!=''">
											<xsl:for-each select="@*">
												<xsl:variable name="OldXMLValue" select="current()"/>
												<xsl:variable name="OldXMLAttribute" select="name()"/>

												<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
													<!--Do the logic here-->

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
														<!--Update-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Update'"/>
															<xsl:with-param name="TableID" select="$oIGDIRTableID"/>
															<xsl:with-param name="ElementID" select="$oIGDIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="concat($oIGDIRXpath,'[@',$OldXMLAttribute,']')"/>
															<xsl:with-param name="OID" select="$uIGDIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$uIGDOID"/>
														</xsl:call-template>
													</xsl:if>

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
														<!--Create-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Create'"/>
															<xsl:with-param name="TableID" select="$oIGDIRTableID"/>
															<xsl:with-param name="ElementID" select="$oIGDIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="$oIGDIRXpath"/>
															<xsl:with-param name="OID" select="$uIGDIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$uIGDOID"/>
														</xsl:call-template>
													</xsl:if>
													<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
														<!--Delete-->
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Delete'"/>
															<xsl:with-param name="TableID" select="$oIGDIRTableID"/>
															<xsl:with-param name="ElementID" select="$oIGDIRElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="''"/>
															<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
															<xsl:with-param name="Xpath" select="$oIGDIRXpath"/>
															<xsl:with-param name="OID" select="$uIGDIRItemOID"/>
															<xsl:with-param name="ParentOID" select="$uIGDOID"/>
														</xsl:call-template>
													</xsl:if>
												</xsl:if>
											</xsl:for-each>
										</xsl:if>
									</xsl:if>
								</xsl:for-each>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>
      
      <!-- ItemGroupDef/Description ,def:leaf, Alias attributes and elements-->
			<xsl:for-each select="$updated/odm:ItemGroupDef">
				<xsl:variable name="uIGDOIDDes" select="@OID"/>
				<xsl:variable name="TTxt" select="odm:Description/odm:TranslatedText"/>
				<xsl:variable name="DLtitle" select="def:leaf/def:title"/>
				
        <xsl:variable name="udefleafnode" select="def:leaf/@xlink:href"/>
        <xsl:variable name="uAliasName" select="odm:Alias/@Name"/>
					<xsl:variable name="uAliasContext" select="odm:Alias/@Context"/>

				<xsl:for-each select="$old/odm:ItemGroupDef[@OID=$uIGDOIDDes]">
					<xsl:if test="odm:Description/odm:TranslatedText !=$TTxt">
						<!--Update-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="odm:Description/odm:TranslatedText/@TableID"/>
							<xsl:with-param name="ElementID" select="odm:Description/odm:TranslatedText/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
							<xsl:with-param name="AttributeName" select="'TranslatedText'"/>
							<xsl:with-param name="AttributeValue" select="$TTxt"/>
							<xsl:with-param name="NodeName" select="&quot;TranslatedText&quot;"/>
							<xsl:with-param name="Xpath" select="odm:Description/odm:TranslatedText/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIGDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="def:leaf/def:title !=$DLtitle">
						<!--Update-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="@TableID"/>
							<xsl:with-param name="ElementID" select="@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
							<xsl:with-param name="AttributeName" select="'def:title'"/>
							<xsl:with-param name="AttributeValue" select="$DLtitle"/>
							<xsl:with-param name="NodeName" select="&quot;def:title&quot;"/>
							<xsl:with-param name="Xpath" select="@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIGDOIDDes"/>
						</xsl:call-template>
					</xsl:if>


					
					<xsl:variable name="odefleafnode" select="def:leaf/@xlink:href"/>
					<xsl:variable name="defleafID" select="def:leaf/@ID"/>
					<xsl:variable name="defleafTableID" select="def:leaf/@TableID"/>
					<xsl:variable name="defleafElementID" select="def:leaf/@ElementID"/>
					<xsl:variable name="defleafXpath" select="def:leaf/@Xpath"/>

					<xsl:if test="$udefleafnode!='' and $odefleafnode!='' and $udefleafnode!=$odefleafnode">
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="$defleafTableID"/>
							<xsl:with-param name="ElementID" select="$defleafElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'xlink:href'"/>
							<xsl:with-param name="AttributeValue" select="$udefleafnode"/>
							<xsl:with-param name="NodeName" select="'def:leaf'"/>
							<xsl:with-param name="Xpath" select="$defleafXpath"/>
							<xsl:with-param name="OID" select="$defleafID"/>
							<xsl:with-param name="ParentOID" select="$uIGDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					
					<xsl:variable name="oAliasName" select="odm:Alias/@Name"/>
					<xsl:variable name="oAliasContext" select="odm:Alias/@Context"/>
					<xsl:variable name="aliasTableID" select="odm:Alias/@TableID"/>
					<xsl:variable name="aliasElementID" select="odm:Alias/@ElementID"/>
					<xsl:variable name="aliasXpath" select="odm:Alias/@Xpath"/>

					<xsl:if test="$uAliasName!='' and $oAliasName!='' and $uAliasName!=$oAliasName">
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="$aliasTableID"/>
							<xsl:with-param name="ElementID" select="$aliasElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'Name'"/>
							<xsl:with-param name="AttributeValue" select="$uAliasName"/>
							<xsl:with-param name="NodeName" select="'Alias'"/>
							<xsl:with-param name="Xpath" select="$aliasXpath"/>
							<xsl:with-param name="OID" select="''"/>
							<xsl:with-param name="ParentOID" select="$uIGDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
          
					<xsl:if test="$uAliasContext!='' and $oAliasContext!='' and $uAliasContext!=$oAliasContext">

						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="$aliasTableID"/>
							<xsl:with-param name="ElementID" select="$aliasElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'Context'"/>
							<xsl:with-param name="AttributeValue" select="$uAliasContext"/>
							<xsl:with-param name="NodeName" select="'Alias'"/>
							<xsl:with-param name="Xpath" select="$aliasXpath"/>
							<xsl:with-param name="OID" select="''"/>
							<xsl:with-param name="ParentOID" select="$uIGDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>
			</xsl:for-each>			
			
			<!-- ItemGroupDef Ends Here-->
      
    <!-- ItemDef Starts-->

			<!-- Delete Element - ItemDef -->
			<xsl:variable name="updatedID" select="$updated/odm:ItemDef"/>
			<xsl:for-each select="$old/odm:ItemDef[not(@OID = $updatedID/@OID)] ">
				<xsl:variable name="oIDOID" select="@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oIDElementID" select="@ElementID"/>
				<xsl:variable name="oIDTableID" select="@TableID"/>
				<xsl:variable name="oIDXpath" select="@Xpath"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oIDTableID"/>
					<xsl:with-param name="ElementID" select="$oIDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oIDXpath"/>
					<xsl:with-param name="OID" select="$oIDOID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
				</xsl:call-template>
			</xsl:for-each>
			<!-- Create Element - ItemDef -->
			<xsl:variable name="oldID" select="$old/odm:ItemDef"/>
			<xsl:for-each select="$updated/odm:ItemDef[not(@OID = $oldID/@OID)] ">
				<xsl:variable name="uIDOID" select="@OID"/>
         <xsl:variable name="oTableID" select="$oldID/@TableID"/>
				<xsl:variable name="oElementID" select="$oldID/@ElementID"/>
				<xsl:variable name="oXpathID" select="$oldID/@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableID"/>
					<xsl:with-param name="ElementID" select="$MDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathID"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
          <xsl:with-param name="OrderNumber" select="5"/>
				</xsl:call-template>
			</xsl:for-each>

			<!-- Update Element - ItemDef Attributes -->
			<xsl:for-each select="$updated/odm:ItemDef">
				<xsl:variable name="uEIDOID" select="@OID"/>

				<xsl:for-each select="@*">
					<xsl:variable name="UpdatedXMLValue" select="."/>
					<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

					<xsl:for-each select="$old/odm:ItemDef">
						<xsl:variable name="oEIDOID" select="@OID"/>
						<xsl:variable name="oIDElementID" select="@ElementID"/>
						<xsl:if test="$uEIDOID=$oEIDOID">

							<xsl:variable name="oIDTableID" select="@TableID"/>
							<xsl:variable name="oIDXpath" select="@Xpath"/>

							<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

							<xsl:for-each select="@*">
								<xsl:variable name="OldXMLValue" select="."/>
								<xsl:variable name="OldXMLAttribute" select="name()"/>

								<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
									<!--Do the logic here-->

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
										<!--Update-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Update'"/>
											<xsl:with-param name="TableID" select="$oIDTableID"/>
											<xsl:with-param name="ElementID" select="$oIDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
                      <xsl:with-param name="Xpath" select="concat($oIDXpath,'[@',$OldXMLAttribute,']')"/>											
											<xsl:with-param name="OID" select="$uEIDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
										<!--Create-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Create'"/>
											<xsl:with-param name="TableID" select="$oIDTableID"/>
											<xsl:with-param name="ElementID" select="$oIDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
											<xsl:with-param name="Xpath" select="$oIDXpath"/>
											<xsl:with-param name="OID" select="$uEIDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
										<!--Delete-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Delete'"/>
											<xsl:with-param name="TableID" select="$oIDTableID"/>
											<xsl:with-param name="ElementID" select="$oIDElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
											<xsl:with-param name="Xpath" select="$oIDXpath"/>
											<xsl:with-param name="OID" select="$uEIDOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>

			<!-- ItemDef/Description def:Origin def:DocumentRef, def:PDfPageRef-->
			<xsl:for-each select="$updated/odm:ItemDef">
				<xsl:variable name="uIDOIDDes" select="@OID"/>
				<xsl:variable name="TTxt" select="odm:Description/odm:TranslatedText"/>
				<xsl:variable name="DfOriginType" select="def:Origin/@Type "/>
				<xsl:variable name="DocRefleafID" select="def:Origin/def:DocumentRef/@leafID"/>

				<xsl:for-each select="$old/odm:ItemDef[@OID=$uIDOIDDes]">
          <xsl:variable name="oTTxt" select="odm:Description/odm:TranslatedText"/>
          <xsl:variable name="oDfOriginType" select="def:Origin/@Type "/>
          <xsl:variable name="oDocRefleafID" select="def:Origin/def:DocumentRef/@leafID"/>
          
					<!-- Description-->
					<xsl:if test="$oTTxt !=$TTxt">
						<!--Update-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="odm:Description/odm:TranslatedText/@TableID"/>
							<xsl:with-param name="ElementID" select="odm:Description/odm:TranslatedText/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
							<xsl:with-param name="AttributeName" select="'TranslatedText'"/>
							<xsl:with-param name="AttributeValue" select="$TTxt"/>
							<xsl:with-param name="NodeName" select="&quot;TranslatedText&quot;"/>
							<xsl:with-param name="Xpath" select="odm:Description/odm:TranslatedText/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<!-- def:Origin-->
					<xsl:if test="$oDfOriginType !='' and $DfOriginType!='' and $oDfOriginType !=$DfOriginType">
						<!--Update-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="def:Origin/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'Type'"/>
							<xsl:with-param name="AttributeValue" select="$DfOriginType"/>
							<xsl:with-param name="NodeName" select="&quot;def:Origin&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="$oDfOriginType ='' and $DfOriginType!=''">
						<!--Create-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Create'"/>
							<xsl:with-param name="TableID" select="def:Origin/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'Type'"/>
							<xsl:with-param name="AttributeValue" select="$DfOriginType"/>
							<xsl:with-param name="NodeName" select="&quot;def:Origin&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="$oDfOriginType !='' and $DfOriginType=''">
						<!--Delete-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Delete'"/>
							<xsl:with-param name="TableID" select="def:Origin/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'Type'"/>
							<xsl:with-param name="AttributeValue" select="$DfOriginType"/>
							<xsl:with-param name="NodeName" select="&quot;def:Origin&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>

					<!-- def:DocumentRef-->
					<xsl:if test="$oDocRefleafID!='' and $DocRefleafID!='' and $oDocRefleafID != $DocRefleafID">
						<!--Update-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Update'"/>
							<xsl:with-param name="TableID" select="def:Origin/def:DocumentRef/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/def:DocumentRef/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'leafID'"/>
							<xsl:with-param name="AttributeValue" select="$DocRefleafID"/>
							<xsl:with-param name="NodeName" select="&quot;def:DocumentRef&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/def:DocumentRef/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="$oDocRefleafID='' and $DocRefleafID!=''">
						<!--Create-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Create'"/>
							<xsl:with-param name="TableID" select="def:Origin/def:DocumentRef/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/def:DocumentRef/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'leafID'"/>
							<xsl:with-param name="AttributeValue" select="$DocRefleafID"/>
							<xsl:with-param name="NodeName" select="&quot;def:DocumentRef&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/def:DocumentRef/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="$oDocRefleafID!='' and $DocRefleafID=''">
						<!--Delete-->
						<xsl:call-template name="UpdateXPTRefresh">
							<xsl:with-param name="Action" select="'Delete'"/>
							<xsl:with-param name="TableID" select="def:Origin/def:DocumentRef/@TableID"/>
							<xsl:with-param name="ElementID" select="def:Origin/def:DocumentRef/@ElementID"/>
							<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
							<xsl:with-param name="AttributeName" select="'leafID'"/>
							<xsl:with-param name="AttributeValue" select="$DocRefleafID"/>
							<xsl:with-param name="NodeName" select="&quot;def:DocumentRef&quot;"/>
							<xsl:with-param name="Xpath" select="def:Origin/def:DocumentRef/@Xpath"/>
							<xsl:with-param name="OID" select="@OID"/>
							<xsl:with-param name="ParentOID" select="$uIDOIDDes"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>
			</xsl:for-each>

			<!-- def:PDFPageRef-->
			<xsl:for-each select="$updated/odm:ItemDef">
				<xsl:variable name="uIDOIDPDFPageRef" select="@OID"/>
				<xsl:for-each select="def:Origin/def:DocumentRef/def:PDFPageRef">
					<xsl:for-each select="@*">
						<xsl:variable name="UpdatedXMLValue" select="."/>
						<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

						<xsl:for-each select="$old/odm:ItemDef">
							<xsl:variable name="oIDOIDPDFPageRef" select="@OID"/>

							<xsl:if test="$uIDOIDPDFPageRef=$oIDOIDPDFPageRef">
								<xsl:for-each select="def:Origin/def:DocumentRef/def:PDFPageRef">

									<xsl:variable name="oAIDElementID" select="@ElementID"/>
									<xsl:variable name="oAIDTableID" select="@TableID"/>
									<xsl:variable name="oAIDXpath" select="@Xpath"/>

									<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

									<xsl:for-each select="@*">
										<xsl:variable name="OldXMLValue" select="."/>
										<xsl:variable name="OldXMLAttribute" select="name()"/>

										<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
											<!--Do the logic here-->

											<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
												<!--Update-->
												<xsl:call-template name="UpdateXPTRefresh">
													<xsl:with-param name="Action" select="'Update'"/>
													<xsl:with-param name="TableID" select="$oAIDTableID"/>
													<xsl:with-param name="ElementID" select="$oAIDElementID"/>
													<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
													<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
													<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
													<xsl:with-param name="NodeName" select="&quot;def:PDFPageRef&quot;"/>
													<xsl:with-param name="Xpath" select="$oAIDXpath"/>
													<xsl:with-param name="OID" select="$uIDOIDPDFPageRef"/>
													<xsl:with-param name="ParentOID" select="$uIDOIDPDFPageRef"/>
												</xsl:call-template>
											</xsl:if>

											<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
												<!--Create-->
												<xsl:call-template name="UpdateXPTRefresh">
													<xsl:with-param name="Action" select="'Create'"/>
													<xsl:with-param name="TableID" select="$oAIDTableID"/>
													<xsl:with-param name="ElementID" select="$oAIDElementID"/>
													<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
													<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
													<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
													<xsl:with-param name="NodeName" select="&quot;def:PDFPageRef&quot;"/>
													<xsl:with-param name="Xpath" select="$oAIDXpath"/>
													<xsl:with-param name="OID" select="$uIDOIDPDFPageRef"/>
													<xsl:with-param name="ParentOID" select="$uIDOIDPDFPageRef"/>
												</xsl:call-template>
											</xsl:if>
											<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
												<!--Delete-->
												<xsl:call-template name="UpdateXPTRefresh">
													<xsl:with-param name="Action" select="'Delete'"/>
													<xsl:with-param name="TableID" select="$oAIDTableID"/>
													<xsl:with-param name="ElementID" select="$oAIDElementID"/>
													<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
													<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
													<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
													<xsl:with-param name="NodeName" select="&quot;def:PDFPageRef&quot;"/>
													<xsl:with-param name="Xpath" select="$oAIDXpath"/>
													<xsl:with-param name="OID" select="$uIDOIDPDFPageRef"/>
													<xsl:with-param name="ParentOID" select="$uIDOIDPDFPageRef"/>
												</xsl:call-template>
											</xsl:if>
										</xsl:if>
									</xsl:for-each>
								</xsl:for-each>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>

	<!-- Delete Element - ItemDef/CodeListRef--><!--
			<xsl:variable name="updatedIDCodeList" select="$updated/odm:ItemDef/CodeListRef"/>
			<xsl:for-each select="$old/odm:ItemDef[@OID=$updatedIDCodeList/../@OID]/CodeListRef[not(@CodeListOID = $updatedIDCodeList/@CodeListOID)] ">
				<xsl:variable name="oIDOIDCL" select="../@OID"/>
				<xsl:variable name="CLOID" select="@CodeListOID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>

				<xsl:variable name="oIDCLItemOID" select="@ItemOID"/>
				<xsl:variable name="oIDCLElementID" select="@ElementID"/>
				<xsl:variable name="oIDCLTableID" select="@TableID"/>
				<xsl:variable name="oIDCLXpath" select="@Xpath"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oIDCLTableID"/>
					<xsl:with-param name="ElementID" select="$oIDCLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;CodeListRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oIDCLXpath"/>
					<xsl:with-param name="OID" select="$CLOID"/>
					<xsl:with-param name="ParentOID" select="$oIDOIDCL"/>
				</xsl:call-template>
			</xsl:for-each>
			--><!-- Create Element - ItemDef/CodeListRef --><!--
			<xsl:variable name="oldIDCodeList" select="$old/odm:ItemDef/CodeListRef"/>
			<xsl:for-each select="$updated/odm:ItemDef[@OID=$oldIDCodeList/../@OID]/CodeListRef[not(@CodeListOID = $oldIDCodeList/@CodeListOID)] ">
				<xsl:variable name="uIDOIDCL" select="../@OID"/>
				<xsl:variable name="oTableIDCL" select="$oldIDCodeList/../@TableID"/>
				<xsl:variable name="oElementIDCL" select="$oldIDCodeList/../@ElementID"/>
				<xsl:variable name="oXpathIDCL" select="$oldIDCodeList/../@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableIDCL"/>
					<xsl:with-param name="ElementID" select="$oElementIDCL"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathIDCL"/>
					<xsl:with-param name="OID" select="@CodeListOID"/>
					<xsl:with-param name="ParentOID" select="$uIDOIDCL"/>
				</xsl:call-template>
			</xsl:for-each>-->
      
      <!--ReCompute Element - CodeListRef-->
      	<xsl:for-each select="$updated/odm:ItemDef">
         
				<xsl:variable name="uIDOIDCLR" select="@OID"/>
				<xsl:variable name="uCodeListRefOID" select="odm:CodeListRef/@CodeListOID"/>
				<xsl:for-each select="$old/odm:ItemDef[@OID=$uIDOIDCLR]">
          
          <xsl:variable name="oCodeListRefOID" select="odm:CodeListRef/@CodeListOID"/>
         
					<!--<xsl:if test="$uCodeListRefOID='' and $oCodeListRefOID !=''">-->
  <xsl:if test="$uCodeListRefOID!=$oCodeListRefOID">
           
						<!--ReCompute-->
            <xsl:variable name="oIDCLElementID" select="odm:CodeListRef/@ElementID"/>
				<xsl:variable name="oIDCLTableID" select="odm:CodeListRef/@TableID"/>
				<xsl:variable name="oIDCLXpath" select="odm:CodeListRef/@Xpath"/>
            
            <xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Update'"/>
					<xsl:with-param name="TableID" select="$oIDCLTableID"/>
					<xsl:with-param name="ElementID" select="$oIDCLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
					<xsl:with-param name="AttributeName" select="'CodeListRef'"/>
					<xsl:with-param name="AttributeValue" select="$uCodeListRefOID"/>
					<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
					<xsl:with-param name="Xpath" select="concat($oIDCLXpath,'[@CodeListOID]')"/>
					<xsl:with-param name="OID" select="$oCodeListRefOID"/>
					<xsl:with-param name="ParentOID" select="$uIDOIDCLR"/>
				</xsl:call-template>
						
					</xsl:if>				

				</xsl:for-each>
			</xsl:for-each>
			
	<!-- Delete Element - ItemDef/def:ValueListRef -->
			<xsl:variable name="updatedIDValueListRef" select="$updated/odm:ItemDef/def:ValueListRef"/>
			<xsl:for-each select="$old/odm:ItemDef[@OID=$updatedIDValueListRef/../@OID]/def:ValueListRef[not(@ValueListOID = $updatedIDValueListRef/@ValueListOID)] ">
				<xsl:variable name="oIDOIDVL" select="../@OID"/>
				<xsl:variable name="VLOID" select="@ValueListOID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>

				<xsl:variable name="oIDVLItemOID" select="@ItemOID"/>
				<xsl:variable name="oIDVLElementID" select="@ElementID"/>
				<xsl:variable name="oIDVLTableID" select="@TableID"/>
				<xsl:variable name="oIDVLXpath" select="@Xpath"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oIDVLTableID"/>
					<xsl:with-param name="ElementID" select="$oIDVLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;def:ValueListRef&quot;"/>
					<xsl:with-param name="Xpath" select="$oIDVLXpath"/>
					<xsl:with-param name="OID" select="$VLOID"/>
					<xsl:with-param name="ParentOID" select="$oIDOIDVL"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - ItemDef/def:ValueListRef -->
			<xsl:variable name="oldIDValueListRef" select="$old/odm:ItemDef/def:ValueListRef"/>
			<xsl:for-each select="$updated/odm:ItemDef[@OID=$oldIDValueListRef/../@OID]/ValueListRef[not(@ValueListOID = $oldIDValueListRef/@ValueListOID)] ">
				<xsl:variable name="uIDOIDVL" select="../@OID"/>
				<xsl:variable name="oTableIDVL" select="$oldIDValueListRef[../@OID=$uIDOIDVL]/@TableID"/>
				<xsl:variable name="oElementIDVL" select="$oldIDValueListRef[../@OID=$uIDOIDVL]/@ElementID"/>
				<xsl:variable name="oXpathIDVL" select="$oldIDValueListRef[../@OID=$uIDOIDVL]/@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableIDVL"/>
					<xsl:with-param name="ElementID" select="$oElementIDVL"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathIDVL"/>
					<xsl:with-param name="OID" select="@ValueListOID"/>
					<xsl:with-param name="ParentOID" select="$uIDOIDVL"/>
        <xsl:with-param name="OrderNumber" select="5"/>
				</xsl:call-template>
			</xsl:for-each>
			<!-- ItemDef Ends-->
      
    <!-- CodeList Starts-->
			<!-- Delete Element - CodeList -->
			<xsl:variable name="updatedCodeList" select="$updated/odm:CodeList"/>
			<xsl:for-each select="$old/odm:CodeList[not(@OID = $updatedCodeList/@OID)] ">
				<xsl:variable name="oCLOID" select="@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oCLElementID" select="@ElementID"/>
				<xsl:variable name="oCLTableID" select="@TableID"/>
				<xsl:variable name="oCLXpath" select="@Xpath"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oCLTableID"/>
					<xsl:with-param name="ElementID" select="$oCLElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oCLXpath"/>
					<xsl:with-param name="OID" select="$oCLOID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - CodeList -->
			<xsl:variable name="oldCL" select="$old/odm:CodeList"/>
			<xsl:for-each select="$updated/odm:CodeList[not(@OID = $oldCL/@OID)] ">
				<xsl:variable name="uCLOID" select="@OID"/>
				<xsl:variable name="oTableCL" select="$oldCL/@TableID"/>
				<xsl:variable name="oElementCL" select="$oldCL/@ElementID"/>
				<xsl:variable name="oXpathCL" select="$oldCL/@Xpath"/>
			
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableCL"/>
					<xsl:with-param name="ElementID" select="$MDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathCL"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
         <xsl:with-param name="OrderNumber" select="4"/>
				</xsl:call-template>
			</xsl:for-each>

			<!-- Update Element - CodeList Attributes -->
			<xsl:for-each select="$updated/odm:CodeList">

				<xsl:variable name="uECLOID" select="@OID"/>

				<xsl:for-each select="@*">
					<xsl:variable name="UpdatedXMLValue" select="."/>
					<xsl:variable name="UpdatedXMLAttribute" select="name()"/>

					<xsl:for-each select="$old/odm:CodeList">
						<xsl:variable name="oECLOID" select="@OID"/>
						<xsl:variable name="oCLElementID" select="@ElementID"/>
						<xsl:if test="$uECLOID=$oECLOID">

							<xsl:variable name="oCLTableID" select="@TableID"/>
							<xsl:variable name="oCLXpath" select="@Xpath"/>

							<!--  Update element(ie.., Create/Update/Delete Attibutes)-->

							<xsl:for-each select="@*">
								<xsl:variable name="OldXMLValue" select="."/>
								<xsl:variable name="OldXMLAttribute" select="name()"/>

								<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
									<!--Do the logic here-->

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
										<!--Update-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Update'"/>
											<xsl:with-param name="TableID" select="$oCLTableID"/>
											<xsl:with-param name="ElementID" select="$oCLElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											<xsl:with-param name="Xpath" select="$oCLXpath"/>
											<xsl:with-param name="OID" select="$uECLOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
										<!--Create-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Create'"/>
											<xsl:with-param name="TableID" select="$oCLTableID"/>
											<xsl:with-param name="ElementID" select="$oCLElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											<xsl:with-param name="Xpath" select="$oCLXpath"/>
											<xsl:with-param name="OID" select="$uECLOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
										<!--Delete-->
										<xsl:call-template name="UpdateXPTRefresh">
											<xsl:with-param name="Action" select="'Delete'"/>
											<xsl:with-param name="TableID" select="$oCLTableID"/>
											<xsl:with-param name="ElementID" select="$oCLElementID"/>
											<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
											<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
											<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											<xsl:with-param name="Xpath" select="$oCLXpath"/>
											<xsl:with-param name="OID" select="$uECLOID"/>
											<xsl:with-param name="ParentOID" select="$MDOID"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>

			<!-- Delete Element - CodeList/CodeListItem -->
			<xsl:variable name="updatedCLCLI" select="$updated/odm:CodeList/odm:CodeListItem"/>			
			<xsl:for-each select="$old/odm:CodeList[@OID=$updatedCLCLI/../@OID]/odm:CodeListItem[not(@CodedValue = $updatedCLCLI/@CodedValue)] ">
				<xsl:variable name="pOID_delCL" select="../@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oCLCLICodedValue" select="@CodedValue"/>
				<xsl:variable name="oCLCLIElementID" select="@ElementID"/>
				<xsl:variable name="oCLCLITableID" select="@TableID"/>
				<xsl:variable name="oCLCLIXpath" select="@Xpath"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oCLCLITableID"/>
					<xsl:with-param name="ElementID" select="$oCLCLIElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
					<xsl:with-param name="Xpath" select="$oCLCLIXpath"/>
					<xsl:with-param name="OID" select="$oCLCLICodedValue"/>
					<xsl:with-param name="ParentOID" select="$pOID_delCL"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - CodeList/CodeListItem -->
			<xsl:variable name="oldCLCLI" select="$old/odm:CodeList/odm:CodeListItem"/>
			<xsl:for-each select="$updated/odm:CodeList[@OID=$oldCLCLI/../@OID]/odm:CodeListItem[not(@CodedValue = $oldCLCLI/@CodedValue)] ">
				<xsl:variable name="pOID_creCL" select="../@OID"/>
				<xsl:variable name="oTableCLCLI" select="$oldCLCLI[../@OID=$pOID_creCL]/@TableID"/>
				<xsl:variable name="oElementCLCLI" select="$oldCLCLI[../@OID=$pOID_creCL]/@ElementID"/>
				<xsl:variable name="oXpathCLCLI" select="$oldCLCLI[../@OID=$pOID_creCL]/@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableCLCLI"/>
					<xsl:with-param name="ElementID" select="$oldCL/@ElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathCLCLI"/>
					<xsl:with-param name="OID" select="@CodedValue"/>
					<xsl:with-param name="ParentOID" select="$pOID_creCL"/>
          <xsl:with-param name="OrderNumber" select="4"/>
				</xsl:call-template>
			</xsl:for-each>

			<!--Update CodeList/CodeListItem Attributes--><!--
			<xsl:for-each select="$updated/odm:CodeList">
				<xsl:variable name="uCLOID" select="@OID"/>
				<xsl:for-each select="odm:CodeListItem">
					<xsl:variable name="uCLCLICodedValue" select="@CodedValue"/>
					<xsl:for-each select="@*">
						<xsl:variable name="UpdatedXMLValue" select="."/>
						<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
						<xsl:for-each select="$old/odm:CodeList">
							<xsl:variable name="oCLOID" select="@OID"/>							
							<xsl:if test="$uCLOID=$oCLOID">
								<xsl:for-each select="odm:CodeListItem">

									<xsl:variable name="oCLCLICodedValue" select="@CodedValue"/>
									<xsl:variable name="oCLCLIElementID" select="@ElementID"/>
									<xsl:variable name="oCLCLITableID" select="@TableID"/>
									<xsl:variable name="oCLCLIXpath" select="@Xpath"/>
									<xsl:if test="$uCLCLICodedValue=$oCLCLICodedValue">
										--><!--  Update element(ie.., Create/Update/Delete Attibutes)--><!--

										<xsl:if test="$uCLCLICodedValue!='' and $oCLCLICodedValue!=''">
											<xsl:for-each select="@*">
												<xsl:variable name="OldXMLValue" select="."/>
												<xsl:variable name="OldXMLAttribute" select="name()"/>

												<xsl:if test="$UpdatedXMLAttribute = $OldXMLAttribute">
													--><!--Do the logic here--><!--

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue!='' and $UpdatedXMLValue!=$OldXMLValue">
														--><!--Update--><!--
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Update'"/>
															<xsl:with-param name="TableID" select="$oCLCLITableID"/>
															<xsl:with-param name="ElementID" select="$oCLCLIElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;CodeListItem&quot;"/>
															<xsl:with-param name="Xpath" select="$oCLCLIXpath"/>
															<xsl:with-param name="OID" select="$uCLCLICodedValue"/>
															<xsl:with-param name="ParentOID" select="$uCLOID"/>
														</xsl:call-template>
													</xsl:if>

													<xsl:if test="$UpdatedXMLValue!='' and $OldXMLValue=''">
														--><!--Create--><!--
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Create'"/>
															<xsl:with-param name="TableID" select="$oCLCLITableID"/>
															<xsl:with-param name="ElementID" select="$oCLCLIElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;CodeListItem&quot;"/>
															<xsl:with-param name="Xpath" select="$oCLCLIXpath"/>
															<xsl:with-param name="OID" select="$uCLCLICodedValue"/>
															<xsl:with-param name="ParentOID" select="$uCLOID"/>
														</xsl:call-template>
													</xsl:if>
													<xsl:if test="$UpdatedXMLValue='' and $OldXMLValue!=''">
														--><!--Delete--><!--
														<xsl:call-template name="UpdateXPTRefresh">
															<xsl:with-param name="Action" select="'Delete'"/>
															<xsl:with-param name="TableID" select="$oCLCLITableID"/>
															<xsl:with-param name="ElementID" select="$oCLCLIElementID"/>
															<xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
															<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
															<xsl:with-param name="AttributeValue" select="$UpdatedXMLValue"/>
															<xsl:with-param name="NodeName" select="&quot;CodeListItem&quot;"/>
															<xsl:with-param name="Xpath" select="$oCLCLIXpath"/>
															<xsl:with-param name="OID" select="$uCLCLICodedValue"/>
															<xsl:with-param name="ParentOID" select="$uCLOID"/>
														</xsl:call-template>
													</xsl:if>
												</xsl:if>
											</xsl:for-each>
										</xsl:if>
									</xsl:if>
								</xsl:for-each>
							</xsl:if>
						</xsl:for-each>
					</xsl:for-each>
				</xsl:for-each>
			</xsl:for-each>-->

			<!--  CodeList/Alias -->
      <xsl:for-each select="$updated/odm:CodeList">
        <xsl:variable name="uCLOIDDecode" select="@OID"/>        
        <xsl:variable name="uCLAliasName" select="odm:Alias/@Name"/>
        <xsl:variable name="uCLAliasContext" select="odm:Alias/@Context"/>    
        
        <xsl:for-each select="$old/odm:CodeList[@OID=$uCLOIDDecode]">
          <!--CodeList/Alias-->
          <xsl:variable name="oCLAliasName" select="odm:Alias/@Name"/>
          <xsl:variable name="oCLAliasContext" select="odm:Alias/@Context"/>
          <xsl:variable name="CLaliasTableID" select="odm:Alias/@TableID"/>
          <xsl:variable name="CLaliasElementID" select="odm:Alias/@ElementID"/>
          <xsl:variable name="CLaliasXpath" select="odm:Alias/@Xpath"/>

          <xsl:if test="$uCLAliasName!='' and $oCLAliasName!='' and $uCLAliasName!=$oCLAliasName">
            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Name'"/>
              <xsl:with-param name="AttributeValue" select="$uCLAliasName"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
          <xsl:if test="$uCLAliasContext!='' and $oCLAliasContext!='' and $uCLAliasContext!=$oCLAliasContext">

            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Context'"/>
              <xsl:with-param name="AttributeValue" select="$uCLAliasContext"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLOIDDecode"/>
            </xsl:call-template>
          </xsl:if>

          </xsl:for-each>
      </xsl:for-each>

      <!--CodeList/CodeListItem/Decode/TranslatedText, CodeList/CodeListItem/Alias-->
      <xsl:for-each select="$updated/odm:CodeList/odm:CodeListItem">
        <xsl:variable name="uCLOIDDecode" select="../@OID"/>
        <xsl:variable name="uCLCLICodedValue" select="@CodedValue"/>
        <xsl:variable name="CLIDecodeTTxt" select="odm:Decode/odm:TranslatedText"/>        
        <xsl:variable name="uCLCLIAliasName" select="odm:Alias/@Name"/>
        <xsl:variable name="uCLCLIAliasContext" select="odm:Alias/@Context"/>

        <xsl:for-each select="$old/odm:CodeList[@OID=$uCLOIDDecode]/odm:CodeListItem[@CodedValue=$uCLCLICodedValue]">
          <!-- Description-->
          <xsl:if test="odm:Decode/odm:TranslatedText !=$CLIDecodeTTxt">
            <!--Update-->
            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="odm:Decode/odm:TranslatedText/@TableID"/>
              <xsl:with-param name="ElementID" select="odm:Decode/odm:TranslatedText/@ElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
              <xsl:with-param name="AttributeName" select="'TranslatedText'"/>
              <xsl:with-param name="AttributeValue" select="$CLIDecodeTTxt"/>
              <xsl:with-param name="NodeName" select="&quot;CodeListItem&quot;"/>
              <xsl:with-param name="Xpath" select="odm:Decode/odm:TranslatedText/@Xpath"/>
              <xsl:with-param name="OID" select="@OID"/>
              <xsl:with-param name="ParentOID" select="$uCLOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
          
          <!--CodeList/CodeListItem/Alias-->

          <xsl:variable name="oCLCLIAliasName" select="odm:Alias/@Name"/>
          <xsl:variable name="oCLCLIAliasContext" select="odm:Alias/@Context"/>
          <xsl:variable name="CLCLIaliasTableID" select="odm:Alias/@TableID"/>
          <xsl:variable name="CLCLIaliasElementID" select="odm:Alias/@ElementID"/>
          <xsl:variable name="CLCLIaliasXpath" select="odm:Alias/@Xpath"/>

          <xsl:if test="$uCLCLIAliasName!='' and $oCLCLIAliasName!='' and $uCLCLIAliasName!=$oCLCLIAliasName">
            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLCLIaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLCLIaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Name'"/>
              <xsl:with-param name="AttributeValue" select="$uCLCLIAliasName"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLCLIaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
          <xsl:if test="$uCLCLIAliasContext!='' and $oCLCLIAliasContext!='' and $uCLCLIAliasContext!=$oCLCLIAliasContext">

            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLCLIaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLCLIaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Context'"/>
              <xsl:with-param name="AttributeValue" select="$uCLCLIAliasContext"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLCLIaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:for-each>
      </xsl:for-each>  
      
	<!--CodeList/EnumeratedItem-->
			<!-- Delete Element - CodeList/EnumeratedItem -->
			<xsl:variable name="updatedCLEI" select="$updated/odm:CodeList/odm:EnumeratedItem"/>		
			<xsl:for-each select="$old/odm:CodeList[@OID=$updatedCLEI/../@OID]/odm:EnumeratedItem[not(@CodedValue = $updatedCLEI/@CodedValue)] ">
				<xsl:variable name="pOID_delCLEI" select="../@OID"/>
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oCLEICodedValue" select="@CodedValue"/>
				<xsl:variable name="oCLEIElementID" select="@ElementID"/>
				<xsl:variable name="oCLEITableID" select="@TableID"/>
				<xsl:variable name="oCLEIXpath" select="@Xpath"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oCLEITableID"/>
					<xsl:with-param name="ElementID" select="$oCLEIElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
					<xsl:with-param name="Xpath" select="$oCLEIXpath"/>
					<xsl:with-param name="OID" select="$oCLEICodedValue"/>
					<xsl:with-param name="ParentOID" select="$pOID_delCLEI"/>
				</xsl:call-template>
			</xsl:for-each>
      
			<!-- Create Element - CodeList/EnumeratedItem -->
			<xsl:variable name="oldCLEI" select="$old/odm:CodeList/odm:EnumeratedItem"/>
			<xsl:for-each select="$updated/odm:CodeList[@OID=$oldCLEI/../@OID]/odm:EnumeratedItem[not(@CodedValue = $oldCLEI/@CodedValue)] ">
				<xsl:variable name="pOID_creCLEI" select="../@OID"/>
				<xsl:variable name="oTableCLEI" select="$oldCLEI[../@OID=$pOID_creCLEI]/@TableID"/>
				<xsl:variable name="oElementCLEI" select="$oldCLEI[../@OID=$pOID_creCLEI]/@ElementID"/>
				<xsl:variable name="oXpathCLEI" select="$oldCLEI[../@OID=$pOID_creCLEI]/@Xpath"/>
				
				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableCLEI"/>
					<xsl:with-param name="ElementID" select="$oElementCLEI"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathCLEI"/>
					<xsl:with-param name="OID" select="@CodedValue"/>
					<xsl:with-param name="ParentOID" select="$pOID_creCLEI"/>
         <xsl:with-param name="OrderNumber" select="4"/>
				</xsl:call-template>
			</xsl:for-each>
      
      <!-- CodeList/EnumeratedItem/Decode/TranslatedText,CodeList/EnumeratedItem/Alias-->

      <xsl:for-each select="$updated/odm:CodeList/odm:EnumeratedItem">
        <xsl:variable name="uCLEIOIDDecode" select="../@OID"/>
        <xsl:variable name="uCLEICodedValue" select="@CodedValue"/>
        <xsl:variable name="EIDecodeTTxt" select="odm:Decode/odm:TranslatedText"/>

        <xsl:variable name="uCLEIAliasName" select="odm:Alias/@Name"/>
        <xsl:variable name="uCLEIAliasContext" select="odm:Alias/@Context"/>

        <xsl:for-each select="$old/odm:CodeList[@OID=$uCLEIOIDDecode]/odm:EnumeratedItem[@CodedValue=$uCLEICodedValue]">
          <!-- Description-->
          <xsl:if test="odm:Decode/odm:TranslatedText !=$EIDecodeTTxt">
            <!--Update-->
            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="odm:Decode/odm:TranslatedText/@TableID"/>
              <xsl:with-param name="ElementID" select="odm:Decode/odm:TranslatedText/@ElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
              <xsl:with-param name="AttributeName" select="'TranslatedText'"/>
              <xsl:with-param name="AttributeValue" select="$EIDecodeTTxt"/>
              <xsl:with-param name="NodeName" select="&quot;CodeListItem&quot;"/>
              <xsl:with-param name="Xpath" select="odm:Decode/odm:TranslatedText/@Xpath"/>
              <xsl:with-param name="OID" select="@OID"/>
              <xsl:with-param name="ParentOID" select="$uCLEIOIDDecode"/>
            </xsl:call-template>
          </xsl:if>

          <!--CodeList/EnumeratedItem/Alias-->

          <xsl:variable name="oCLEIAliasName" select="odm:Alias/@Name"/>
          <xsl:variable name="oCLEIAliasContext" select="odm:Alias/@Context"/>
          <xsl:variable name="CLEIaliasTableID" select="odm:Alias/@TableID"/>
          <xsl:variable name="CLEIaliasElementID" select="odm:Alias/@ElementID"/>
          <xsl:variable name="CLEIaliasXpath" select="odm:Alias/@Xpath"/>

          <xsl:if test="$uCLEIAliasName!='' and $oCLEIAliasName!='' and $uCLEIAliasName!=$oCLEIAliasName">
            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLEIaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLEIaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Name'"/>
              <xsl:with-param name="AttributeValue" select="$uCLEIAliasName"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLEIaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLEIOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
          <xsl:if test="$uCLEIAliasContext!='' and $oCLEIAliasContext!='' and $uCLEIAliasContext!=$oCLEIAliasContext">

            <xsl:call-template name="UpdateXPTRefresh">
              <xsl:with-param name="Action" select="'Update'"/>
              <xsl:with-param name="TableID" select="$CLEIaliasTableID"/>
              <xsl:with-param name="ElementID" select="$CLEIaliasElementID"/>
              <xsl:with-param name="IsAttribute" select="&quot;True&quot;"/>
              <xsl:with-param name="AttributeName" select="'Context'"/>
              <xsl:with-param name="AttributeValue" select="$uCLEIAliasContext"/>
              <xsl:with-param name="NodeName" select="'Alias'"/>
              <xsl:with-param name="Xpath" select="$CLEIaliasXpath"/>
              <xsl:with-param name="OID" select="''"/>
              <xsl:with-param name="ParentOID" select="$uCLEIOIDDecode"/>
            </xsl:call-template>
          </xsl:if>
        </xsl:for-each>
      </xsl:for-each>     
      
			<!-- CodeList Ends-->
      
    
  	<!-- WhereClauseDef Starts-->
			<!-- Delete Element - WhereClauseDef -->
			<xsl:variable name="updatedWCD" select="$updated/def:WhereClauseDef"/>
			<xsl:for-each select="$old/def:WhereClauseDef[not(@OID = $updatedWCD/@OID)] ">
			
				<xsl:variable name="OldXMLAttribute" select="name()"/>
				<xsl:variable name="oWCDOID" select="@OID"/>
				<xsl:variable name="oWCDElementID" select="@ElementID"/>
				<xsl:variable name="oWCDTableID" select="@TableID"/>
				<xsl:variable name="oWCDXpath" select="@Xpath"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Delete'"/>
					<xsl:with-param name="TableID" select="$oWCDTableID"/>
					<xsl:with-param name="ElementID" select="$oWCDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>
					<xsl:with-param name="AttributeName" select="$OldXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oWCDXpath"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
				</xsl:call-template>
			</xsl:for-each>

			<!-- Create Element - WhereClauseDef -->
			<xsl:variable name="oldWCD" select="$old/def:WhereClauseDef"/>
			<xsl:for-each select="$updated/def:WhereClauseDef[not(@OID = $oldWCD/@OID)] ">
         <xsl:variable name="oTableWCD" select="$oldWCD/@TableID"/>
				<xsl:variable name="oElementWCD" select="$oldWCD/@ElementID"/>
				<xsl:variable name="oXpathWCD" select="$oldWCD/@Xpath"/>			

				<xsl:variable name="UpdatedXMLAttribute" select="name()"/>
				<xsl:call-template name="UpdateXPTRefresh">
					<xsl:with-param name="Action" select="'Create'"/>
					<xsl:with-param name="TableID" select="$oTableWCD"/>
					<xsl:with-param name="ElementID" select="$MDElementID"/>
					<xsl:with-param name="IsAttribute" select="&quot;False&quot;"/>         
					<xsl:with-param name="AttributeName" select="$UpdatedXMLAttribute"/>
					<xsl:with-param name="AttributeValue" select="''"/>
					<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
					<xsl:with-param name="Xpath" select="$oXpathWCD"/>
					<xsl:with-param name="OID" select="@OID"/>
					<xsl:with-param name="ParentOID" select="$MDOID"/>
          <xsl:with-param name="OrderNumber" select="2"/>
				</xsl:call-template>
			</xsl:for-each>
<!-- WhereClauseDef Ends-->

    </xmlcompare>
  </xsl:template>

  <xsl:template name="UpdateXPTRefresh">
		<xsl:param name="Action"/>
		<xsl:param name="TableID"/>
		<xsl:param name="ElementID"/>
		<xsl:param name="IsAttribute"/>
		<xsl:param name="AttributeName"/>
		<xsl:param name="AttributeValue"/>
		<xsl:param name="NodeName"/>
		<xsl:param name="Xpath"/>
		<xsl:param name="OID"/>
		<xsl:param name="ParentOID"/>
    <xsl:param name="OrderNumber"/>
		<xsl:element name="XPTRefresh">
			<xsl:attribute name="Action">
				<xsl:value-of select="normalize-space($Action)"/>
			</xsl:attribute>
			<xsl:attribute name="AttributeName">
				<xsl:value-of select="normalize-space($AttributeName)"/>
			</xsl:attribute>
			<xsl:attribute name="AttributeValue">
				<xsl:value-of select="normalize-space($AttributeValue)"/>
			</xsl:attribute>
			<xsl:attribute name="ElementID">
				<xsl:value-of select="normalize-space($ElementID)"/>
			</xsl:attribute>
			<xsl:attribute name="IsAttribute">
				<xsl:value-of select="normalize-space($IsAttribute)"/>
			</xsl:attribute>
			<xsl:attribute name="NodeName">
				<xsl:value-of select="$NodeName"/>
			</xsl:attribute>
			<xsl:attribute name="OID">
				<xsl:value-of select="normalize-space($OID)"/>
			</xsl:attribute>
			<xsl:attribute name="TableID">
				<xsl:value-of select="normalize-space($TableID)"/>
			</xsl:attribute>
			<xsl:attribute name="Xpath">
				<xsl:value-of select="normalize-space($Xpath)"/>
			</xsl:attribute>
			<xsl:attribute name="ParentOID">
				<xsl:value-of select="normalize-space($ParentOID)"/>
			</xsl:attribute>
    	<xsl:attribute name="OrderNumber">
				<xsl:value-of select="normalize-space($OrderNumber)"/>
			</xsl:attribute>
		</xsl:element>
    <xsl:text/>
	</xsl:template>
</xsl:stylesheet>