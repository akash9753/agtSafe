
<!-- 
XSLT to generate DataValidation Error Result

    Define.xml has been validated based on the "Define-XML-2-0-Specification.pdf" and 
    The result of this has been generated as of Pinnacle-21-Rule

  11/10/2018          Vijayalakshmi G         
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:odm="http://www.cdisc.org/ns/odm/v1.3" xmlns:def="http://www.cdisc.org/ns/def/v2.0"
                version="1.0" xml:lang="en">
	<xsl:output method="xml" version="2.0" indent="yes" encoding="utf-8"/>

	<xsl:variable name="vUpper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>

	<xsl:variable name="vLower" select="'abcdefghijklmnopqrstuvwxyz'"/>

	<xsl:variable name="vAlpha" select="concat($vUpper, $vLower)"/>

	<xsl:variable name="vDigits" select="'0123456789'"/>

	<xsl:variable name="vAlphaNumeric" select="concat($vAlpha,$vDigits)"/>

	<xsl:template match="/">
		<xsl:variable name="fileoid" select="odm:ODM/@FileOID"/>
		<xsl:variable name="filetype" select="odm:ODM/@FileType"/>
		<xsl:variable name="creationDT" select="odm:ODM/@CreationDateTime"/>
    <xsl:variable name="defStandardNameforAdamCheck" select="odm:ODM/odm:Study/odm:MetaDataVersion/@def:StandardName"/>
		<xsl:processing-instruction name="xml-stylesheet">type="text/xsl" href="define2-0-0.xsl"</xsl:processing-instruction>
		<xsl:variable name="rootElement" select="name(/*)"/>
		<xsl:text> </xsl:text>
		<DataValidation>
			<xsl:for-each select="odm:ODM">
        
				<xsl:choose>
					<xsl:when test="not(@FileType)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
							<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ODMVersion' must appear on element 'ODM' &quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="@FileType=''">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'FileType' value.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
							</xsl:call-template>
						</xsl:if>

						<xsl:if test="@FileType !='Snapshot'">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0019&quot;"/>
								<xsl:with-param name="Description" select="&quot;The FileType must have a value of 'Snapshot'&quot;"/>
								<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid FileType value&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>	
        
				<xsl:for-each select="@*">
            <xsl:if test="((name()!='xmlns')and (name()!='xmlns:xlink')and (name()!='xmlns:def') and (name()!='ODMVersion') and (name()!='FileType') and (name()!='FileOID') and (name()!='CreationDateTime') and (name()!='Originator') and (name()!='xmlns:xsi')and (name()!='xsi:schemalocation')and (name()!='AsOfDateTime'))">
             <xsl:if test="($defStandardNameforAdamCheck = 'SDTM-IG')">
                <xsl:if test="((name()!='SourceSystem')and (name()!='SourceSystemVersion'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ODM'.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
						</xsl:call-template>
                   </xsl:if>
              </xsl:if>
             </xsl:if>
					        
          
					<xsl:if test="(string-length(name())&gt;1000)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
							<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="name()"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
							<xsl:with-param name="NodeName" select="name(parent::*)"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<xsl:choose>
					<xsl:when test="not(@ODMVersion)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
							<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ODMVersion' must appear on element 'ODM' &quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="@ODMVersion=''">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'ODMVersion' value.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>

				<xsl:choose>
					<xsl:when test="not(@FileOID)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
							<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'FileOID' must appear on element 'ODM' &quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="@FileOID=''">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'FileOID' value.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>

				<xsl:choose>
					<xsl:when test="not(@CreationDateTime)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
							<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'CreationDateTime' must appear on element 'ODM' &quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:if test="@CreationDateTime=''">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'CreationDateTime' value.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>

			<xsl:for-each select="odm:ODM/odm:Study">
				<xsl:variable name="studyOID" select="@OID"/>
				<xsl:for-each select="@*">
					<xsl:if test="((name()!='OID'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$studyOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Study'.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study&quot;"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="(string-length(name())&gt;1000)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
							<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="name()"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
							<xsl:with-param name="NodeName" select="name(parent::*)"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<xsl:for-each select="*">
					<xsl:if test="((name()!='GlobalVariables') and (name()!='MetaDataVersion'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$studyOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Study'.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<xsl:for-each select="odm:GlobalVariables/*">
					<xsl:if test="((name()!='StudyName') and (name()!='StudyDescription')and (name()!='ProtocolName'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$studyOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'GlobalVariables'.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study/GlobalVariables&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>
				<xsl:choose>
					<xsl:when test="not(@OID)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
							<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'Study' &quot;"/>
							<xsl:with-param name="NodeName" select="&quot;Study&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="@OID =''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:when>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>

			<xsl:for-each select="odm:ODM/odm:Study/odm:MetaDataVersion">
        <xsl:variable name="MDVOID" select="@OID"/>
				<xsl:for-each select="@*">
					<xsl:if test="((name()!='OID')and (name()!='Name')and (name()!='Description') and (name()!='def:DefineVersion') and (name()!='def:StandardName') and (name()!='def:StandardVersion'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$MDVOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'MetaDataVersion'.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;MetaDataVersion&quot;"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="(string-length(name())&gt;1000)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
							<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="name()"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
							<xsl:with-param name="NodeName" select="name(parent::*)"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<xsl:if test="((@def:DefineVersion != '2.0.0') and (@def:DefineVersion != '1.0.0'))">
          <testt>
            <xsl:value-of select="@def:DefineVersion"/>
          </testt>
					<xsl:call-template name="ErrorGenaration">
						<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0020&quot;"/>
						<xsl:with-param name="Description" select="&quot;The def:DefineVersion should have a value of '1.0.0' for Define-XML v1.0 and '2.0.0' for Define-XML v2.0.&quot;"/>
						<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
						<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
						<xsl:with-param name="ItemID" select="$MDVOID"/>
						<xsl:with-param name="ErrorMessage" select="&quot;Invalid def:DefineVersion value&quot;"/>
						<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
					</xsl:call-template>
				</xsl:if>

				<xsl:variable name="defStandardName" select="@def:StandardName"/>
				<xsl:if test="(($defStandardName != 'SDTM-IG') and ($defStandardName != 'SEND-IG') and ($defStandardName != 'ADaM-IG')) ">
					<xsl:call-template name="ErrorGenaration">
						<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0021&quot;"/>
						<xsl:with-param name="Description" select="&quot;Standard Name must have a value of 'SDTM-IG', 'SEND-IG', or 'ADaM-IG'. Define-XML specification represents Standard Name as def:StandardName attribute on MetaDataVersion element.&quot;"/>
						<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
						<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
						<xsl:with-param name="ItemID" select="$MDVOID"/>
						<xsl:with-param name="ErrorMessage" select="&quot;Invalid Standard Name value&quot;"/>
						<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
					</xsl:call-template>
				</xsl:if>
				<xsl:variable name="defStandardVersion" select="@def:StandardVersion"/>
				<xsl:if test="$defStandardName = 'SDTM-IG'">
					<xsl:if test="(($defStandardVersion != '3.1.2') and ($defStandardVersion != '3.1.3') and ($defStandardVersion != '3.2'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0022&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Standard Version must have a valid value for the given Standard Name. Allowed values are '3.1.2', '3.1.3', or '3.2' for SDTM-IG, '3.0' for SEND-IG, and '1.0' for ADaM-IG. Define-XML specification represents Standard Version as def:StandardVersion attribute on MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$MDVOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid Standard Version value&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:if>
				<xsl:if test="$defStandardName = 'SEND-IG'">
					<xsl:if test="$defStandardVersion != '3.0'">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0022&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Standard Version must have a valid value for the given Standard Name. Allowed values are '3.1.2', '3.1.3', or '3.2' for SDTM-IG, '3.0' for SEND-IG, and '1.0' for ADaM-IG. Define-XML specification represents Standard Version as def:StandardVersion attribute on MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$MDVOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid Standard Version value&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:if>
				<xsl:if test="$defStandardName = 'ADaM-IG'">
					<xsl:if test="$defStandardVersion != '1.0'">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0022&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Standard Version must have a valid value for the given Standard Name. Allowed values are '3.1.2', '3.1.3', or '3.2' for SDTM-IG, '3.0' for SEND-IG, and '1.0' for ADaM-IG. Define-XML specification represents Standard Version as def:StandardVersion attribute on MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$MDVOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid Standard Version value&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:if>
        
       <xsl:if test="($defStandardNameforAdamCheck = 'ADaM-IG')">
               <xsl:if test="def:AnnotatedCRF">
                 <xsl:call-template name="ErrorGenaration">
							      <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							      <xsl:with-param name="Description"
							                      select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
							      <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							      <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							      <xsl:with-param name="ItemID" select="$MDVOID"/>
							      <xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'MetaDataVersion'.&quot;"/>
							      <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion&quot;"/>
						      </xsl:call-template>
               
               </xsl:if>
              </xsl:if>



				<!--         Element:  def:AnnotatedCRF
		 Requirement: Optional; Cardinality: Zero or One

				Child Element	def:DocumentRef
		 Requirement: Conditional Required for def:AnnotatedCRF and def:SupplementalDoc;
		 Cardinality: One or More;
		 Attribute: leafID is Mandatory
	 -->
        <xsl:if test="$defStandardName = 'SDTM-IG'">
          <xsl:for-each select="def:AnnotatedCRF/*">
            <xsl:if test="((name()!='def:DocumentRef'))">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
                <xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
                <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:AnnotatedCRF'.&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:AnnotatedCRF&quot;"/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="def:AnnotatedCRF/def:DocumentRef/*">
            <xsl:if test="((name()!=''))">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
                <xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
                <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:AnnotatedCRF/def:DocumentRef&quot;"/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>
          <xsl:for-each select="def:AnnotatedCRF/def:DocumentRef/@*">
            <xsl:if test="((name()!='leafID'))">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
                <xsl:with-param name="Description"
                                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
                <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:DocumentRef'.&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:AnnotatedCRF/def:DocumentRef&quot;"/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>

          <xsl:if test="def:AnnotatedCRF">
            <xsl:if test="count(def:AnnotatedCRF)&gt;1">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
                <xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
                <xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;def:AnnotatedCRF&quot;"/>
              </xsl:call-template>
            </xsl:if>
            <!--<xsl:if test="not(def:AnnotatedCRF/def:DocumentRef)">
						<xsl:call-template name="ErrorGenaration">
              <xsl:with-param name="Pinnacle-21-RuleID" select ="&quot;DD0006&quot;"/>
            <xsl:with-param name="Description" select ="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
              <xsl:with-param name="Category" select ="&quot;Presence&quot;"/>
            <xsl:with-param name="Severity" select ="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'def:DocumentRef' value.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:AnnotatedCRF&quot;"/>
						</xsl:call-template>
					</xsl:if>-->


            <xsl:for-each select="def:AnnotatedCRF/def:DocumentRef">
              <xsl:choose>
                <xsl:when test="not(@leafID)">
                  <xsl:call-template name="ErrorGenaration">
                    <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
                    <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                    <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                    <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                    <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                    <xsl:with-param name="ErrorMessage" select="&quot;Attribute 'leafID' must appear on element 'def:DocumentRef'.&quot;"/>
                    <xsl:with-param name="NodeName" select="&quot;def:AnnotatedCRF/def:DocumentRef&quot;"/>
                  </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:if test="@leafID=''">
                    <xsl:call-template name="ErrorGenaration">
                      <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
                      <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                      <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                      <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                      <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                      <xsl:with-param name="ErrorMessage" select="&quot;Missing reuired 'leafID' value.&quot;"/>
                      <xsl:with-param name="NodeName" select="&quot;def:AnnotatedCRF/def:DocumentRef&quot;"/>
                    </xsl:call-template>
                  </xsl:if>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>

            <xsl:for-each select="def:SupplementalDoc/def:DocumentRef">
              <xsl:choose>
                <xsl:when test="not(@leafID)">
                  <xsl:call-template name="ErrorGenaration">
                    <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
                    <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                    <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                    <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                    <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                    <xsl:with-param name="ErrorMessage" select="&quot;Attribute 'leafID' must appear on element 'def:DocumentRef'.&quot;"/>
                    <xsl:with-param name="NodeName" select="&quot;def:SupplementalDoc/def:DocumentRef&quot;"/>
                  </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:if test="not(@leafID)">
                    <xsl:call-template name="ErrorGenaration">
                      <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
                      <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                      <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                      <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                      <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                      <xsl:with-param name="ErrorMessage" select="&quot;Missing reuired 'leafID' value.&quot;"/>
                      <xsl:with-param name="NodeName" select="&quot;def:SupplementalDoc/def:DocumentRef&quot;"/>
                    </xsl:call-template>
                  </xsl:if>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>

            <!--Business Rule:  Match the leafID of AnnotatedCRF with ID of def:leaf and
	                     get the not matched count to check the required no.of def:DocumentRef -->

            <xsl:variable name="annotatedCRFleafID" select="def:AnnotatedCRF/def:DocumentRef/@leafID"/>
            <xsl:variable name="noOfDocuments">
              <xsl:value-of select="count(def:leaf[@ID!=$annotatedCRFleafID])"/>
            </xsl:variable>


            <xsl:variable name="noOfDocumentRef">
              <xsl:value-of select="count(def:SupplementalDoc/def:DocumentRef)"/>
            </xsl:variable>

            <xsl:if test="$noOfDocuments !=$noOfDocumentRef">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="ItemID" select="&quot;-&quot;"/>
                <xsl:with-param name="ErrorMessage" select="concat('Required no. of def:DocumentRef is ', $noOfDocuments)"/>
                <xsl:with-param name="NodeName" select="&quot;def:SupplementalDoc&quot;"/>
              </xsl:call-template>
            </xsl:if>

            <!--            Child Element of def:DocumentRef :  def:PDFPageRef
			Requirement  : Conditional Required for def:Origin/@Type=”CRF”;
			Cardinality  : Zero or more;
			Attributes   : Type, PageRefs, FirstPage, LastPage
			Type         : Required with Allowable Values: PhysicalRef , NamedDestination
			Business Rule: When Type="NamedDestination", 
						   NamedDestinations have to be created within the PDF document 
						   to be able to link to them with a hyperlink.
	-->

            <!--def:ItemDef/def:Origin/Type=CRF-->
            <xsl:for-each select="odm:ItemDef/def:Origin[@Type='CRF']">
              <xsl:variable name="itemdefOID" select="../@OID"/>
              <xsl:choose>
                <xsl:when test="not(def:DocumentRef)">
                  <xsl:call-template name="ErrorGenaration">
                    <xsl:with-param name="ItemID" select="$itemdefOID"/>
                    <xsl:with-param name="ErrorMessage" select="&quot;def:DocumentRef is Required for the origin Type=CRF&quot;"/>
                    <xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
                  </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>

                  <xsl:variable name="PDFPageRefCount" select="count(def:DocumentRef/def:PDFPageRef)"/>
                  <xsl:if test="$PDFPageRefCount=0">
                    <xsl:call-template name="ErrorGenaration">
                      <xsl:with-param name="ItemID" select="$itemdefOID"/>
                      <xsl:with-param name="ErrorMessage" select="&quot;def:PDFPageRef is Required for the origin Type=CRF&quot;"/>
                      <xsl:with-param name="NodeName" select="&quot;def:PDFPageRef&quot;"/>
                    </xsl:call-template>
                  </xsl:if>
                  <xsl:choose>
                    <xsl:when test="not(def:DocumentRef/def:PDFPageRef/@Type)">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
                        <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ItemID" select="$itemdefOID"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Type' must appear on element 'def:PDFPageRef' when the 'origin Type=CRF'.&quot;"/>
                        <xsl:with-param name="NodeName" select="&quot;ItemDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:if test="def:DocumentRef/def:PDFPageRef/@Type=''">
                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
                          <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Type' value for 'def:PDFPageRef' when the origin Type=CRF&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>
                      </xsl:if>
                    </xsl:otherwise>
                  </xsl:choose>

                  <!--Attribute:Type; Required-->
                  <xsl:variable name="TypeValue" select="def:DocumentRef/def:PDFPageRef/@Type"/>
                  <xsl:if test="(($TypeValue!='PhysicalRef') and ($TypeValue!='NamedDestination'))">
                    <xsl:call-template name="ErrorGenaration">
                      <xsl:with-param name="ItemID" select="$itemdefOID"/>
                      <xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for Type attribute is PhysicalRef NamedDestination&quot;"/>
                      <xsl:with-param name="NodeName" select="&quot;ItemDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                    </xsl:call-template>
                  </xsl:if>

                  <!--Attributes: PageRefs : Optional; Allowable Values:Text;
	             FirstPage: Conditional Required if PageRefs is not provided; Allowable Values: Integer
				 LastPage : Conditional Required if PageRefs is not provided; Allowable Values: Integer-->

                  <xsl:choose>
                    <xsl:when test="not(def:DocumentRef/def:PDFPageRef/@PageRefs)">

                      <xsl:if test="((not(def:DocumentRef/def:PDFPageRef/@FirstPage))or (not(def:DocumentRef/def:PDFPageRef/@LastPage)))">
                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                          <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>
                      </xsl:if>
                      <xsl:if test="((def:DocumentRef/def:PDFPageRef/@FirstPage='')or (def:DocumentRef/def:PDFPageRef/@LastPage=''))">
                        <xsl:call-template name="ErrorGenaration">    
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                          <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>
                      </xsl:if>
                     

                     
                      
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:if test="((def:DocumentRef/def:PDFPageRef/@FirstPage)or (def:DocumentRef/def:PDFPageRef/@LastPage))">
                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                          <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>
                      </xsl:if>
                      <xsl:if test="(def:DocumentRef/def:PDFPageRef/@PageRefs='')">
                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                          <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>
                      </xsl:if>
                    </xsl:otherwise>
                  </xsl:choose>

                  <!-- 
                    to test the value is numeric or not
                  -->
                  <xsl:choose>
                    <xsl:when test="(def:DocumentRef/def:PDFPageRef/@LastPage)">
                      <xsl:if test="((string-length(def:DocumentRef/def:PDFPageRef/@LastPage) &gt; 0) and string(number(def:DocumentRef/def:PDFPageRef/@LastPage)) = 'NaN') ">

                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                          <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>

                      </xsl:if>
                    </xsl:when>
                  </xsl:choose>

                  <!-- 
                    to test the value is numeric or not
                  -->
                    <xsl:choose>

                    <xsl:when test="(def:DocumentRef/def:PDFPageRef/@FirstPage)">
                      <xsl:if test="((string-length(def:DocumentRef/def:PDFPageRef/@FirstPage) &gt; 0) and string(number(def:DocumentRef/def:PDFPageRef/@FirstPage)) = 'NaN') ">

                        <xsl:call-template name="ErrorGenaration">
                          <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                          <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                          <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                          <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                          <xsl:with-param name="ItemID" select="$itemdefOID"/>
                          <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                          <xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
                        </xsl:call-template>

                      </xsl:if>
                      
                    </xsl:when>

                  </xsl:choose>
                  
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>

            <!--  def:PDFPageRef is Optional in def:MethodDef       -->
            <xsl:for-each select="odm:MethodDef/def:DocumentRef">
              <xsl:variable name="methodDefOID" select="../@OID"/>

              <xsl:if test="def:PDFPageRef">

                <!--Type Attribute in def:MethodDef/def:DocumentRef/def:PDFPageRef-->
                <xsl:variable name="TypeValue" select="def:PDFPageRef/@Type"/>
                <xsl:if test="(($TypeValue!='PhysicalRef') and ($TypeValue!='NamedDestination'))">
                  <xsl:call-template name="ErrorGenaration">
                    <xsl:with-param name="ItemID" select="$methodDefOID"/>
                    <xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for Type attribute is PhysicalRef NamedDestination&quot;"/>
                    <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                  </xsl:call-template>
                </xsl:if>

                <!--Attributes: PageRefs : Optional; Allowable Values:Text;
	             FirstPage: Conditional Required if PageRefs is not provided; Allowable Values: Integer
				 LastPage : Conditional Required if PageRefs is not provided; Allowable Values: Integer-->
                <xsl:choose>
                  <xsl:when test="not(def:PDFPageRef/@PageRefs)">

                    <xsl:if test="((not(def:PDFPageRef/@FirstPage))or (not(def:PDFPageRef/@LastPage)))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                        <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                    <xsl:if test="((def:PDFPageRef/@FirstPage='')or (def:PDFPageRef/@LastPage=''))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                        <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="((def:PDFPageRef/@FirstPage)or (def:PDFPageRef/@LastPage))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                        <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                    <xsl:if test="(def:PDFPageRef/@PageRefs='')">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                        <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
                
                <!-- 
                    to test the value is numeric or not
                  -->
                <xsl:choose>
                  <xsl:when test="(def:PDFPageRef/@LastPage)">
                    <xsl:if test="((string-length(def:PDFPageRef/@LastPage) &gt; 0) and string(number(def:PDFPageRef/@LastPage)) = 'NaN') ">

                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                        <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>

                    </xsl:if>
                  </xsl:when>
                </xsl:choose>
                
                 <!-- 
                    to test the value is numeric or not
                  -->
                <xsl:choose>
                  <xsl:when test="(def:PDFPageRef/@FirstPage)">
                    <xsl:if test="((string-length(def:PDFPageRef/@FirstPage) &gt; 0) and string(number(def:PDFPageRef/@FirstPage)) = 'NaN') ">

                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                        <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ItemID" select="$methodDefOID"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                        <xsl:with-param name="NodeName" select="&quot;MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>

                    </xsl:if>
                  </xsl:when>
                </xsl:choose>
                
              </xsl:if>
            </xsl:for-each>

            <!--  def:PDFPageRef is Optional in def:CommentDef-->

            <xsl:for-each select="def:CommentDef/def:DocumentRef">
              <xsl:variable name="commentDefOID" select="../@OID"/>
              <xsl:if test="def:PDFPageRef">

                <!--Type Attribute in def:MethodDef/def:DocumentRef/def:PDFPageRef-->
                <xsl:variable name="TypeValue" select="def:PDFPageRef/@Type"/>
                <xsl:if test="(($TypeValue!='PhysicalRef') and ($TypeValue!='NamedDestination'))">
                  <xsl:call-template name="ErrorGenaration">
                    <xsl:with-param name="ItemID" select="$commentDefOID"/>
                    <xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for Type attribute is PhysicalRef NamedDestination&quot;"/>
                    <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                  </xsl:call-template>
                </xsl:if>

                <!--Attributes: PageRefs : Optional; Allowable Values:Text;
	             FirstPage: Conditional Required if PageRefs is not provided; Allowable Values: Integer
				 LastPage : Conditional Required if PageRefs is not provided; Allowable Values: Integer-->
                <xsl:choose>
                  <xsl:when test="not(def:PDFPageRef/@PageRefs)">

                    <xsl:if test="((not(def:PDFPageRef/@FirstPage))or (not(def:PDFPageRef/@LastPage)))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                        <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                    <xsl:if test="((def:PDFPageRef/@FirstPage='')or (def:PDFPageRef/@LastPage=''))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                        <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="((def:PDFPageRef/@FirstPage)or (def:PDFPageRef/@LastPage))">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0037&quot;"/>
                        <xsl:with-param name="Description" select="&quot;FirstPage and LastPage are required when PageRefs Is not provided.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing or invalid page range.&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                    <xsl:if test="(def:PDFPageRef/@PageRefs='')">
                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0035&quot;"/>
                        <xsl:with-param name="Description" select="&quot;The Pages field is required when Origin is CRF. Define-XML specification represents Pages as def:PDFPageRef elements within def:DocumentRef element.&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Missing Pages value.&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>

                <!-- 
                    to test the value is numeric or not
                  -->
                <xsl:choose>
                  <xsl:when test="(def:PDFPageRef/@FirstPage)">
                    <xsl:if test="((string-length(def:PDFPageRef/@FirstPage) &gt; 0) and string(number(def:PDFPageRef/@FirstPage)) = 'NaN') ">

                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                        <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>

                    </xsl:if>
                  </xsl:when>
                </xsl:choose>

                <!-- 
                    to test the value is numeric or not
                  -->
                <xsl:choose>
                  <xsl:when test="(def:PDFPageRef/@LastPage)">
                    <xsl:if test="((string-length(def:PDFPageRef/@LastPage) &gt; 0) and string(number(def:PDFPageRef/@LastPage)) = 'NaN') ">

                      <xsl:call-template name="ErrorGenaration">
                        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                        <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                        <xsl:with-param name="ItemID" select="$commentDefOID"/>
                        <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                        <xsl:with-param name="NodeName" select="&quot;CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
                      </xsl:call-template>

                    </xsl:if>
                  </xsl:when>
                </xsl:choose>
                
                
              </xsl:if>
            </xsl:for-each>
          </xsl:if>
        </xsl:if>
        
				<!--def:AnnotatedCRF-->

				<!--   Element: def:SupplementalDoc

		Requirement: Optional
		Cardinality:Zero or one
		BusinessRule:If multiple documents are provided 
					 there will be multiple def:DocumentRef child elements within 
					 the def:SupplementalDoc element.
	   Child Element: def:DocumentRef
-->


				<xsl:if test="def:SupplementalDoc">

					<xsl:for-each select="def:SupplementalDoc/*">
						<xsl:if test="((name()!='def:DocumentRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:SupplementalDoc&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:SupplementalDoc/def:DocumentRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:SupplementalDoc/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:SupplementalDoc/def:DocumentRef/@*">
						<xsl:if test="((name()!='leafID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:SupplementalDoc/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:if test="count(def:SupplementalDoc)&gt;1">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
							<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:SupplementalDoc&quot;"/>
						</xsl:call-template>
					</xsl:if>

					<xsl:if test="not(def:SupplementalDoc/def:DocumentRef)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;def:DocumentRef is required&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:SupplementalDoc&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:if>


				<!--def:SupplementalDoc-->

				<!-- Element      : def:ValueListDef Element
     		     Requirement  : Conditional 
	 			 Cardinality  : Required for each unique value of the ValueListOID attribute within the MetaDataVersion.
				 Business Rule: A def:ValueListDef element to describe the variable QNAM must be included for 
			                    each ItemGroupDef element that has def:Class=”RELATIONSHIP". 			
				 Attribute    : OID
				 Child Element:ItemRef
			-->

				<xsl:for-each select="odm:ItemDef/def:ValueListRef">
					<xsl:variable name="valueListRefOID" select="@ValueListOID"/>          
          <xsl:if test ="$valueListRefOID!=''">
					<xsl:variable name="checkoid">
						<xsl:for-each select="../../def:ValueListDef">
							<xsl:variable name="valueListDefOID" select="@OID"/>
              <xsl:if test ="$valueListDefOID!=''">
                <xsl:choose>
                  <xsl:when test="$valueListRefOID=$valueListDefOID">
                    <xsl:value-of select="&quot;true&quot;"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="&quot;false&quot;"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="not(contains($checkoid,'true'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0017&quot;"/>
							<xsl:with-param name="Description" select="&quot;Referenced ValueListOID value must match OID attribute of def:ValueListDef element within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$valueListRefOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Referenced Value Level metadata is missing&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>
				<!--Attribute : OID Required; Allowable Values:Text-->
				<xsl:for-each select="def:ValueListDef">
					<xsl:variable name="VLDefOID" select="@OID"/>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$VLDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:ValueListDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="*">
						<xsl:if test="((name()!='ItemRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$VLDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:ValueListDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="ItemRef/@*">
						<xsl:if test="((name()!='ItemOID')and (name()!='OrderNumber') and (name()!='Mandatory')and (name()!='MethodOID')and (name()!='MethodOID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@ItemOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ItemRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef/ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
          
           <xsl:if test="($defStandardNameforAdamCheck = 'SDTM-IG')">
               <xsl:if test="((name()!='Role')and (name()!='RoleCodeList'))">
                 <xsl:call-template name="ErrorGenaration">
							      <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
							      <xsl:with-param name="Description"
							                      select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
							      <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							      <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							      <xsl:with-param name="ItemID" select="&quot;@ItemOID&quot;"/>
							      <xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ItemRef'.&quot;"/>
							      <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef/ItemRef&quot;"/>
						      </xsl:call-template>
               
               </xsl:if>
              </xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:ItemRef/*">
						<xsl:if test="((name()!='def:WhereClauseRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$VLDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'ItemRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef/ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:ItemRef/def:WhereClauseRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$VLDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:WhereClauseRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef/ItemRef/def:WhereClauseRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:ItemRef/def:WhereClauseRef/@*">
						<xsl:if test="((name()!='WhereClauseOID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$VLDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:WhereClauseRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:ValueListDef/ItemRef/def:WhereClauseRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:choose>
						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'def:ValueListDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@OID=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:if test="@OID= following::*/@OID">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0014&quot;"/>
									<xsl:with-param name="Description" select="&quot;The OID attribute for def:ValueListDef element must be unique within a single MetaDataVersion.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="'Duplicate ValueListDef OID'"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<!--Check for Value Level metadata is not referenced-->

					<xsl:variable name="VLDOID" select="@OID"/>
          <xsl:if test="$VLDOID!=''">
					<xsl:variable name="checkoid">            
						<xsl:for-each select="../odm:ItemDef/def:ValueListRef">
							<xsl:variable name="IDVLRVLOID" select="@ValueListOID"/>
              <xsl:if test ="$IDVLRVLOID!=''">
							<xsl:choose>
								<xsl:when test="$VLDOID=$IDVLRVLOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="not(contains($checkoid,'true'))">

						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0081&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Only Value Level metadata that are referenced from a Variable should be included in Define.xml. Define-XML specification represents Value Level metadata as def:ValueListDef elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
							<xsl:with-param name="ItemID" select="$VLDOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Value Level metadata is not referenced.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>



				<!-- Business Rule: A def:ValueListDef element to describe 
								the variable QNAM must be included for 
								each ItemGroupDef element that has def:Class=”RELATIONSHIP".
			-->

				<!-- Child Element  : def:ItemRef
			     Requirement    : Required
				 Cardinality    : One for each dataset variable (when parent node is an ItemGroupDef element) 
				 			      One for each Value to be defined (when parent node is a ValueListDef element).
				 Attributes     : ItemOID, OrderNumber, Mandatory, KeySequence, Role, RoleCodeListOID, MethodOID
			     Child Elements : def:WhereClauseRef (valid only when parent node is a ValueListDef)
			-->

				<xsl:for-each select="def:ValueListDef">
					<xsl:variable name="valueListDefOID" select="@OID"/>
					<xsl:if test="not(odm:ItemRef)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="ItemID" select="$valueListDefOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;OID is Required&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<xsl:for-each select="def:ValueListDef/odm:ItemRef">
					<xsl:variable name="vlItemRefOID" select="@ItemOID"/>
          <xsl:if test ="$vlItemRefOID!=''">

					<xsl:variable name="checkoid">
						<xsl:for-each select="../../odm:ItemDef">
							<xsl:variable name="itemDefOID" select="@OID"/>
              <xsl:if test ="$itemDefOID!=''">
							<xsl:choose>
								<xsl:when test="$itemDefOID=$vlItemRefOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="not(contains($checkoid,'true'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0046&quot;"/>
							<xsl:with-param name="Description" select="&quot;The value of ItemOID attribute references a non-existent ItemDef element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$vlItemRefOID"/>
							<xsl:with-param name="ErrorMessage" select="'Referenced ItemDef is missing'"/>
							<xsl:with-param name="NodeName" select="&quot;def:ValueListDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
        
            </xsl:if>
				</xsl:for-each>

				<xsl:for-each select="odm:ItemGroupDef/odm:ItemRef">
					<xsl:variable name="igItemRefOID" select="@ItemOID"/>
<xsl:if test ="$igItemRefOID!=''">
					<xsl:variable name="checkoid">
						<xsl:for-each select="../../odm:ItemDef">
							<xsl:variable name="itemDefOID" select="@OID"/>
              <xsl:if test ="$itemDefOID!=''">
							<xsl:choose>
								<xsl:when test="$itemDefOID=$igItemRefOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="not(contains($checkoid,'true'))">

						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0046&quot;"/>
							<xsl:with-param name="Description" select="&quot;The value of ItemOID attribute references a non-existent ItemDef element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$igItemRefOID"/>
							<xsl:with-param name="ErrorMessage" select="'Referenced ItemDef is missing'"/>
							<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
  </xsl:if>
				</xsl:for-each>


				<!--Attributes     : ItemOID, OrderNumber, Mandatory, KeySequence, Role, RoleCodeListOID, MethodOID-->


				<xsl:for-each select="def:ValueListDef">
					<xsl:choose>
						<xsl:when test="not(odm:ItemRef)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0067&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Only Variables that are referenced from a Dataset or Value Level metadata should be included in Define.xml. Define-XML specification represents variables as ItemDef elements and variable references as ItemRef elements within an ItemGroupDef or def:ValueListDef.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Variable 'ItemRef' is not referenced&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="not(odm:ItemRef/@ItemOID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ItemOID' must appear on element 'ItemRef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="odm:ItemRef/@ItemOID=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'ItemOID' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>

				<!--  Attribute       : Mandatory
					      Allowable values: Yes,No 
						   -->

				<xsl:for-each select="def:ValueListDef/odm:ItemRef">

					<xsl:choose>
						<xsl:when test="not(@Mandatory)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@ItemOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute Mandatory must appear for ItemRef &quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:if test="@Mandatory = ''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@ItemOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Mandatory' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:variable name="mandatoryValue" select="@Mandatory"/>

							<xsl:if test="(($mandatoryValue!='Yes') and ($mandatoryValue!='No'))">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0074&quot;"/>
									<xsl:with-param name="Description" select="&quot;The Mandatory attribute must have a value of 'Yes' or 'No'.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@ItemOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Invalid Mandatory value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
				<!--
Attribute   : MethodOID
Conditional : This attribute and the associated MethodDef are Required 
		      when the Type attribute for the def:Origin child element of the referenced ItemDef is Derived.
			  Otherwise, this attribute is Optional.-->

				<xsl:for-each select="def:ValueListDef/odm:ItemRef">
					<xsl:variable name="VLIRItemOID" select="@ItemOID"/>

					<xsl:choose>
						<xsl:when test="not(@MethodOID)">
							<xsl:for-each select="../../odm:ItemDef">
								<xsl:if test="$VLIRItemOID = @OID">
									<xsl:if test="def:Origin/@Type='Derived'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0042&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;The Method field is required when Origin is Derived. Define-XML specification represents Methods as MethodDef elements, which are referenced by MethodOID attribute within ItemRef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="$VLIRItemOID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Method reference&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/odm:ItemRef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:when>

						<xsl:otherwise>


							<xsl:variable name="methodOID" select="@MethodOID"/>
              <xsl:if test ="$methodOID!=''">
							<xsl:variable name="checkoid">
								<xsl:for-each select="../../odm:MethodDef">
									<xsl:variable name="methodDefOID" select="@OID"/>
                  <xsl:if test ="$methodDefOID!=''">
									<xsl:choose>
										<xsl:when test="$methodDefOID=$methodOID">
											<xsl:value-of select="&quot;true &quot;"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="&quot;false &quot;"/>
										</xsl:otherwise>
									</xsl:choose>
                    </xsl:if>
								</xsl:for-each>
							</xsl:variable>


							<xsl:if test="not(contains($checkoid,'true'))">

								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0016&quot;"/>
									<xsl:with-param name="Description" select="&quot;Referenced Method must first be defined on Methods tab. Define-XML specification represents Methods as MethodDef elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="$methodOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Referenced Method is missing&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/odm:ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>
                </xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>


				<xsl:for-each select="odm:ItemGroupDef/odm:ItemRef">
					<xsl:variable name="IGDIRItemOID" select="@ItemOID"/>

					<xsl:choose>
						<xsl:when test="not(@MethodOID)">
							<xsl:for-each select="../../odm:ItemDef">
								<xsl:if test="$IGDIRItemOID = @OID">
									<xsl:if test="def:Origin/@Type='Derived'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0042&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;The Method field is required when Origin is Derived. Define-XML specification represents Methods as MethodDef elements, which are referenced by MethodOID attribute within ItemRef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="$IGDIRItemOID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Method reference&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef/odm:ItemRef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:when>

						<xsl:otherwise>
							<xsl:variable name="methodOID" select="@MethodOID"/>
              <xsl:if test ="$methodOID!=''">
							<xsl:variable name="checkoid">
								<xsl:for-each select="../../odm:MethodDef">
									<xsl:variable name="methodDefOID" select="@OID"/>
                  <xsl:if test ="$methodDefOID!=''">
									<xsl:choose>
										<xsl:when test="$methodDefOID=$methodOID">
											<xsl:value-of select="&quot;true &quot;"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="&quot;false &quot;"/>
										</xsl:otherwise>
									</xsl:choose>
                 </xsl:if>
								</xsl:for-each>
							</xsl:variable>


							<xsl:if test="not(contains($checkoid,'true'))">

								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0016&quot;"/>
									<xsl:with-param name="Description" select="&quot;Referenced Method must first be defined on Methods tab. Define-XML specification represents Methods as MethodDef elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="$methodOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Referenced Method is missing&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/odm:ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>
            </xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>



				<!-- Child Element  : def:WhereClauseRef
	         Requirement    : Conditional 
			 Cardinality    : One or more def:WhereClauseRef elements is Required for
			 				  each ItemRef child element within a def:ValueListDef 
			 Business Rule  : Not allowed as a child element of an ItemRef element 
			 				  if the parent node is a def:ItemGroupDef element. It will be considered non-conforming
		
		-->

				<xsl:for-each select="def:ValueListDef/odm:ItemRef">
					<xsl:choose>

						<xsl:when test="not(def:WhereClauseRef)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;def:WhereClauseRef is Required&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/odm:ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:choose>

								<xsl:when test="not(def:WhereClauseRef/@WhereClauseOID)">

									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;WhereClauseOID is Required&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;def:WhereClauseRef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>

									<!--def:ValueListDef Element ends -->


									<!-- Cardinality: A def:WhereClause is required for each unique value of
					              the WhereClauseOID attribute value in a def:WhereClauseRef element 
								  within the MetaDataVersion
				
				-->

									<xsl:for-each select="def:WhereClauseRef">
										<xsl:variable name="whereClauseOID" select="@WhereClauseOID"/>
                    <xsl:if test ="$whereClauseOID!=''">

										<xsl:variable name="checkoid">
											<xsl:for-each select="../../../def:WhereClauseDef">
												<xsl:variable name="WCDefOID" select="@OID"/>
                        <xsl:if test ="$WCDefOID!=''">
												<xsl:choose>
													<xsl:when test="$whereClauseOID=$WCDefOID">
														<xsl:value-of select="&quot;true &quot;"/>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="&quot;false &quot;"/>
													</xsl:otherwise>
												</xsl:choose>
                          </xsl:if>
											</xsl:for-each>
										</xsl:variable>

										<xsl:if test="not(contains($checkoid,'true'))">

											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="ItemID" select="$whereClauseOID"/>
												<xsl:with-param name="ErrorMessage" select="concat('def:WhereClauseDef is Required for ', $whereClauseOID)"/>
												<xsl:with-param name="NodeName" select="&quot;def:WhereClauseRef&quot;"/>
											</xsl:call-template>
										</xsl:if>
                      </xsl:if>
                  
									</xsl:for-each>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>

				<xsl:for-each select="odm:ItemGroupDef/odm:ItemRef">

					<xsl:if test="def:WhereClauseRef">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;def:WhereClauseRef is not allowed as a child element of an def:ItemGroupDef/ItemRef element&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/odm:ItemRef&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>


				<!--def:ValueListDef Element ends -->


				<!-- Element    : def:WhereClauseDef				
				     Requirement: Conditional 
					 Cardinality: A def:WhereClause is required for each unique value of
					              the WhereClauseOID attribute value in a def:WhereClauseRef element 
								  within the MetaDataVersion				
				-->
				<xsl:for-each select="def:WhereClauseDef">
					<xsl:variable name="WCDefOID" select="@OID"/>
					<xsl:for-each select="*">
						<xsl:if test="(name()!='RangeCheck')">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:WhereClauseDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID')and (name()!='def:CommentOID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:WhereClauseDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:RangeCheck/*">
						<xsl:if test="(name()!='CheckValue')">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'RangeCheck'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef/RangeCheck&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:RangeCheck/@*">
						<xsl:if test="((name()!='SoftHard')and (name()!='def:ItemOID')and (name()!='Comparator'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'RangeCheck'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef/RangeCheck&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:RangeCheck/odm:CheckValue/*">
						<xsl:if test="(name()!='')">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'CheckValue'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef/RangeCheck/CheckValue&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:RangeCheck/odm:CheckValue/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'CheckValue'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:WhereClauseDef/RangeCheck/CheckValue&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:variable name="whereClauseOID" select="@OID"/>
					<xsl:choose>
						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'WhereClauseDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:if test="@OID=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(odm:RangeCheck)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="ItemID" select="$whereClauseOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;RangeCheck is Required&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:for-each select="odm:RangeCheck">

								<xsl:variable name="defItemOID" select="@def:ItemOID"/>
<xsl:if test ="$defItemOID!=''">
								<xsl:variable name="checkoid">
									<xsl:for-each select="../../odm:ItemGroupDef/odm:ItemRef">
										<xsl:variable name="IGIRItemOID" select="@ItemOID"/>
<xsl:if test ="$IGIRItemOID!=''">
										<xsl:choose>
											<xsl:when test="$defItemOID=$IGIRItemOID">
												<xsl:value-of select="&quot;true &quot;"/>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="&quot;false &quot;"/>
											</xsl:otherwise>
										</xsl:choose>
  </xsl:if>
									</xsl:for-each>
								</xsl:variable>

								<xsl:if test="not(contains($checkoid,'true'))">

									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="$defItemOID"/>
										<xsl:with-param name="ErrorMessage" select="concat('ItemRef is Required for ', $defItemOID)"/>
										<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
									</xsl:call-template>
								</xsl:if>

</xsl:if>

								<xsl:choose>
									<xsl:when test="not(@Comparator)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="ItemID" select="$whereClauseOID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Comparator is Required&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name="ComparatorValue" select="@Comparator"/>

										<xsl:if test="(($ComparatorValue!='LT') and ($ComparatorValue!='LE') and ($ComparatorValue!='GT') and ($ComparatorValue!='GE') and ($ComparatorValue!='EQ') and ($ComparatorValue!='NE')and ($ComparatorValue!='IN') and ($ComparatorValue!='NOTIN'))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="ItemID" select="$whereClauseOID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for Comparator attribute is 'LT','LE','GT','GE','EQ','NE','IN','NOTIN'&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:otherwise>
								</xsl:choose>

								<xsl:choose>
									<xsl:when test="not(@SoftHard)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="$whereClauseOID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'SoftHard' must appear on element 'def:WhereClauseDef'.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/WhereClauseDef&quot;"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:if test="@SoftHard=''">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
												<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="$whereClauseOID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'SoftHard' value.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/WhereClauseDef&quot;"/>
											</xsl:call-template>
										</xsl:if>
										<xsl:variable name="SoftHardValue" select="@SoftHard"/>

										<xsl:if test="(($SoftHardValue!='Soft') and ($SoftHardValue!='Hard'))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0044&quot;"/>
												<xsl:with-param name="Description" select="&quot;The SoftHard attribute must have a value of 'Soft' or 'Hard'.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="$whereClauseOID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Invalid SoftHard value&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:otherwise>
								</xsl:choose>


								<xsl:if test="not(@def:ItemOID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="$whereClauseOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;def:ItemOID is Required&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
									</xsl:call-template>
								</xsl:if>


								<!-- Element    : CheckValue
					     Requirement: Required 
						 Cardinality: One-->

								<xsl:if test="not(odm:CheckValue)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="$whereClauseOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;CheckValue is missing&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>

				<!--def:WhereClauseDef ends -->


				<!-- Element    :ItemGroupDef
				     Requirement: Required 
					 Cardinality: One or more-->

				<xsl:choose>
					<xsl:when test="not(odm:ItemGroupDef)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
							<xsl:with-param name="ErrorMessage" select="&quot;ItemGroupDef is Required&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:for-each select="odm:ItemGroupDef">
							<xsl:variable name="IGDefOID" select="@OID"/>
							<xsl:for-each select="odm:ItemRef">

								<xsl:if test="@ItemOID= following-sibling::*/@ItemOID">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0041&quot;"/>
										<xsl:with-param name="Description" select="&quot;The ItemOID attribute for ItemRef element must be unique within a single ItemGroupDef.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="'Duplicate ItemRef ItemOID'"/>
										<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:if>

								<xsl:if test="@KeySequence= following-sibling::*/@KeySequence">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0041&quot;"/>
										<xsl:with-param name="Description" select="&quot;The KeySequence attribute for ItemRef element must be unique within a single ItemGroupDef.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="'Duplicate KeySequence'"/>
										<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>

							<xsl:for-each select="*">
								<xsl:if test="((name()!='Description') and (name()!='ItemRef')and (name()!='def:leaf') and (name()!='Alias'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="@*">
								<xsl:if test="((name()!='OID') and (name()!='Domain') and (name()!='Name')and (name()!='Repeating') and (name()!='IsReferenceData') and (name()!='SASDatasetName') and (name()!='Purpose') and (name()!='def:Structure') and (name()!='def:Class') and (name()!='def:ArchiveLocationID') and (name()!='def:CommentOID'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:if test="(string-length(name())&gt;1000)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
										<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="name()"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
										<xsl:with-param name="NodeName" select="name(parent::*)"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>

							<xsl:for-each select="odm:Description/*">
								<xsl:if test="((name()!='TranslatedText'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Description'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Description&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="odm:Description/@*">
								<xsl:if test="((name()!=''))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Description'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Description&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="odm:Description/odm:TranslatedText/@*">
								<xsl:if test="((name()!='xml:lang'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'TranslatedText'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Description/TranslatedText&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="odm:ItemRef/*">
								<xsl:if test="((name()!=''))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'ItemRef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="odm:ItemRef/@*">
								<xsl:if test="((name()!='ItemOID')and (name()!='OrderNumber')and (name()!='Mandatory')and (name()!='KeySequence')and (name()!='MethodOID')and (name()!='Role')and (name()!='RoleCodeList'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@ItemOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ItemRef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>

							<xsl:for-each select="def:leaf/*">
								<xsl:if test="((name()!='def:title'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:leaf'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/def:leaf&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="def:leaf/@*">
								<xsl:if test="((name()!='ID')and (name()!='xlink:href'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:leaf'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/def:leaf&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>

							<xsl:for-each select="def:leaf/def:title/*">
								<xsl:if test="((name()!=''))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:title'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/def:leaf/def:title&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>
							<xsl:for-each select="def:leaf/def:title/@*">
								<xsl:if test="((name()!=''))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
										<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="$IGDefOID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:title'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/def:leaf/def:title&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:for-each>						


							<!--Attributes: OID, Name, Repeating, IsReferenceData, SASDatasetName,Domain, 
				Purpose, def:Structure, def:Class, def:ArchiveLocationID, def:CommentOID-->

							<xsl:choose>
								<xsl:when test="not(@OID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@OID=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required OID value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="@OID= following::*/@OID">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0030&quot;"/>
											<xsl:with-param name="Description" select="&quot;The OID attribute for ItemGroupDef element must be unique within a single MetaDataVersion.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="'Duplicate ItemGroupDef OID'"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>

								<xsl:when test="not(@Name)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@Name=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
 <xsl:if test ="$defStandardNameforAdamCheck='SDTM-IG'">
							<xsl:choose>               
								<xsl:when test="not(@Domain)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Domain' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@Domain=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Domain' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
   </xsl:if>
							<xsl:choose>
								<xsl:when test="not(@SASDatasetName)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0047&quot;"/>
										<xsl:with-param name="Description" select="&quot;For regulatory submission data, SASDatasetName attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing SASDatasetName value&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@SASDatasetName=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0047&quot;"/>
											<xsl:with-param name="Description" select="&quot;For regulatory submission data, SASDatasetName attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing SASDatasetName value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:if test="@SASDatasetName= following::*/@SASDatasetName">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0051&quot;"/>
											<xsl:with-param name="Description" select="&quot;The SASDatasetName attribute for ItemGroupDef element must be unique within a single MetaDataVersion.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="'Duplicate SASDatasetName'"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:if test="string-length() != ((string-length(translate(@SASDatasetName,$vAlpha,''))) or (string-length() != string-length(translate(@SASDatasetName,$vAlphaNumeric,''))))">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0048&quot;"/>
											<xsl:with-param name="Description" select="&quot;The SASDatasetName value does not conform to SAS Transport file naming rules. Allowed string pattern for SASDatasetName is '[A-Za-z_][A-Za-z0-9_]*'.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Format&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid SASDatasetName value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:choose>
								<xsl:when test="not(@Repeating)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Repeating' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@Repeating=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Repeating' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<!--Allowable value for Repeating attribute-->
									<xsl:variable name="RepeatingValue" select="@Repeating"/>
									<xsl:if test="(($RepeatingValue!='Yes') and ($RepeatingValue!='No'))">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0072&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;The Repeating attribute for Dataset must have a value of 'Yes' or 'No'. Define-XML specification represents Datasets as ItemGroupDef elements within MetaDataVersion element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid Repeating value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:if test="@IsReferenceData">
								<!--Allowable value for IsReferenceData attribute-->
								<xsl:variable name="IsReferenceDataValue" select="@IsReferenceData"/>
								<xsl:if test="(($IsReferenceDataValue!='Yes') and ($IsReferenceDataValue!='No'))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0073&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;The IsReferenceData attribute for Dataset must have a value of 'Yes' or 'No'. Define-XML specification represents Datasets as ItemGroupDef elements within MetaDataVersion element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid Reference Data value&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:if>

							<xsl:choose>
								<xsl:when test="not(@Purpose)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Purpose' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@Purpose=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Purpose' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<!--Allowable value for Purpose attribute-->
									<xsl:variable name="PurposeValue" select="@Purpose"/>
									<xsl:if test="(($PurposeValue!='Tabulation') and ($PurposeValue!='Analysis'))">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0053&quot;"/>
											<xsl:with-param name="Description" select="&quot;The Purpose attribute must have a value of 'Tabulation' for SDTM and SEND data and 'Analysis' for ADaM data.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid Purpose value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:choose>

								<xsl:when test="not(@def:Structure)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'def:Structure' must appear on element 'ItemGroupDef'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@def:Structure=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required def:Structure value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:choose>
								<xsl:when test="not(@def:Class)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0054&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;For regulatory submission data, Class field is required and must be included in Define.xml and cannot be empty. Define-XML specification represents Class as def:Class attribute on ItemGroupDef element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing Class value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@def:Class=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0054&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;For regulatory submission data, Class field is required and must be included in Define.xml and cannot be empty. Define-XML specification represents Class as def:Class attribute on ItemGroupDef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Class value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:choose>
										<xsl:when test="(($defStandardName = 'SDTM-IG') or ($defStandardName = 'SEND-IG')) ">

											<xsl:if test="((@def:Class!='SPECIAL PURPOSE') and (@def:Class!='FINDINGS')and (@def:Class!='EVENTS') and (@def:Class!='TRIAL DESIGN')and (@def:Class!='INTERVENTIONS') and (@def:Class!='RELATIONSHIP'))">
												<xsl:call-template name="ErrorGenaration">
													<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0055&quot;"/>
													<xsl:with-param name="Description"
													                select="&quot;The Class attribute must have a value of 'SPECIAL PURPOSE', 'FINDINGS', 'EVENTS', 'INTERVENTIONS', 'TRIAL DESIGN', or 'RELATIONSHIP' for SDTM and SEND data and 'SUBJECT LEVEL ANALYSIS DATASET', 'BASIC DATA STRUCTURE', or 'ADAM OTHER' for ADaM data.&quot;"/>
													<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
													<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
													<xsl:with-param name="ItemID" select="@OID"/>
													<xsl:with-param name="ErrorMessage" select="&quot;Invalid Class value&quot;"/>
													<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
												</xsl:call-template>
											</xsl:if>
										</xsl:when>
										<xsl:otherwise>
											<xsl:if test="($defStandardName = 'ADaM-IG')">
												<xsl:if test="((@def:Class!='SUBJECT LEVEL ANALYSIS DATASET') and (@def:Class!='BASIC DATA STRUCTURE')and (@def:Class!='ADAM OTHER'))">
													<xsl:call-template name="ErrorGenaration">
														<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0055&quot;"/>
														<xsl:with-param name="Description"
														                select="&quot;The Class attribute must have a value of 'SPECIAL PURPOSE', 'FINDINGS', 'EVENTS', 'INTERVENTIONS', 'TRIAL DESIGN', or 'RELATIONSHIP' for SDTM and SEND data and 'SUBJECT LEVEL ANALYSIS DATASET', 'BASIC DATA STRUCTURE', or 'ADAM OTHER' for ADaM data.&quot;"/>
														<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
														<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
														<xsl:with-param name="ItemID" select="@OID"/>
														<xsl:with-param name="ErrorMessage" select="&quot;Invalid Class value&quot;"/>
														<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
													</xsl:call-template>
												</xsl:if>
											</xsl:if>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:choose>
								<xsl:when test="not(@def:ArchiveLocationID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0056&quot;"/>
										<xsl:with-param name="Description" select="&quot;For regulatory submission data, def:ArchiveLocationID attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing def:ArchiveLocationID value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@def:ArchiveLocationID=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0056&quot;"/>
											<xsl:with-param name="Description" select="&quot;For regulatory submission data, def:ArchiveLocationID attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing def:ArchiveLocationID value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:variable name="defArchiveLocationID" select="@def:ArchiveLocationID"/>
									<xsl:variable name="defleafOID" select="def:leaf/@OID"/>
									<xsl:choose>
										<xsl:when test="$defArchiveLocationID !=$defleafOID">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0018&quot;"/>
												<xsl:with-param name="Description" select="&quot;The ItemGroupDef def:ArchiveLocationID should match the ID of the child def:leaf.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;def:ArchiveLocationID/def:leaf mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
											</xsl:call-template>
										</xsl:when>
										<xsl:otherwise>
											<xsl:variable name="href" select="substring-before(def:leaf/@xlink:href,'.')"/>
											<xsl:variable name="sasDatasetName" select="translate(@SASDatasetName,$vUpper, $vLower)"/>
											<xsl:if test="$href != $sasDatasetName">
												<xsl:call-template name="ErrorGenaration">
													<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0052&quot;"/>
													<xsl:with-param name="Description" select="&quot;SASDatasetName attribute and filename (without extension) identified by def:ArchiveLocationID (def:leaf/xlink:href attribute) must have the same value.&quot;"/>
													<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
													<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
													<xsl:with-param name="ItemID" select="$href"/>
													<xsl:with-param name="ErrorMessage" select="&quot;SASDatasetName/def:ArchiveLocationID mismatch.&quot;"/>
													<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
												</xsl:call-template>
											</xsl:if>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>
								<xsl:when test="not(odm:Description)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0057&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;For regulatory submission data, Description field is required for each Dataset, Method, and Comment and must be included in Define.xml and cannot be empty. Define-XML specification represents Description as Description/TranslatedText element within ItemGroupDef, MethodDef, or def:CommentDef element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing Description value&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<!--Element    : TranslatedText
	Requirement: Required 
	Cardinality: One or more.
				Multiple TranslatedText child elements can be used to provide
				the dataset description in different languages. 
				One for each language the description is desired.
-->


									<xsl:if test="not(odm:Description/odm:TranslatedText)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0057&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;For regulatory submission data, Description field is required for each Dataset, Method, and Comment and must be included in Define.xml and cannot be empty. Define-XML specification represents Description as Description/TranslatedText element within ItemGroupDef, MethodDef, or def:CommentDef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Description value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/odm:Description&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>


							<!--Element    : Alias
	Requirement: Conditional
	Cardinality: One or more 
				 When used for regulatory submission, the Alias element is required for 
				 each ItemGroup that is part of a Domain that has been split into different datasets.
 -->

							<xsl:choose>
								<xsl:when test="@Domain= following::*/@Domain">
									<xsl:variable name="dubDomain" select="@Domain"/>
									<xsl:if test="@Domain=$dubDomain">
                    <xsl:choose>
                      <xsl:when test="not(odm:Alias)">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0063&quot;"/>
												<xsl:with-param name="Description" select="&quot;Alias is required for each split dataset (where more than one ItemGroupDef exists for the same Domain) to provide a description for the full dataset.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing Alias&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
											</xsl:call-template>
                    </xsl:when>
                      
                    <xsl:otherwise>
                      <!--Attribute   :Context; Required
Allowable Values: As a child element of an ItemGroupDef element: DomainDescription

Attribute       : Name; Required;
Allowable Values: As a child element of an ItemGroupDef element: DomainDescription

-->
                      <xsl:for-each select="odm:Alias/*">
                        <xsl:if test="((name()!=''))">
                          <xsl:call-template name="ErrorGenaration">
                            <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
                            <xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
                            <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
                            <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                            <xsl:with-param name="ItemID" select="$IGDefOID"/>
                            <xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Alias'.&quot;"/>
                            <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
                          </xsl:call-template>
                        </xsl:if>
                      </xsl:for-each>
                      <xsl:for-each select="odm:Alias/@*">
                        <xsl:if test="((name()!='Context')and (name()!='Name'))">
                          <xsl:call-template name="ErrorGenaration">
                            <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
                            <xsl:with-param name="Description"
                                            select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
                            <xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
                            <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                            <xsl:with-param name="ItemID" select="$IGDefOID"/>
                            <xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Alias'.&quot;"/>
                            <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
                          </xsl:call-template>
                        </xsl:if>
                      </xsl:for-each>
                      
                      <xsl:if test="odm:Alias/@Context=''">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
												<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context' value.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
											</xsl:call-template>
										</xsl:if>

										<xsl:if test="odm:Alias/@Context !='DomainDescription'">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0064&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;The Alias Context attribute must have a value of 'DomainDescription' for split datasets (when child of ItemGroupDef) and 'nci:ExtCodeID' for CodeList, CodeListItem or EnumeratedItem elements.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Invalid Alias Context value&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
											</xsl:call-template>
										</xsl:if>
                      <xsl:if test="odm:Alias/@Name =''">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
												<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
											</xsl:call-template>
										</xsl:if>

										<xsl:variable name="ParentDescriptionValue" select="concat(substring-before(odm:Description/odm:TranslatedText,'-'),'s')"/>
										<xsl:variable name="aliasName" select="odm:Alias/@Name"/>
										<xsl:if test="((odm:Alias/@Context ='DomainDescription') and (not(contains($aliasName,$ParentDescriptionValue))))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Allowable value of Name is Description of Parent Domain&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
											</xsl:call-template>
										</xsl:if>
                    
                    </xsl:otherwise>
                    </xsl:choose>									
                  
									</xsl:if>
								</xsl:when>
								<xsl:otherwise>
<xsl:choose>
  <xsl:when test="@Domain= preceding-sibling::*[1]/@Domain">
      <xsl:variable name="dubDomain" select="@Domain"/>
      <xsl:if test="@Domain=$dubDomain">
        <xsl:choose>
          <xsl:when test="not(odm:Alias)">
            <xsl:call-template name="ErrorGenaration">
              <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0063&quot;"/>
              <xsl:with-param name="Description" select="&quot;Alias is required for each split dataset (where more than one ItemGroupDef exists for the same Domain) to provide a description for the full dataset.&quot;"/>
              <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
              <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
              <xsl:with-param name="ItemID" select="@OID"/>
              <xsl:with-param name="ErrorMessage" select="&quot;Missing Alias&quot;"/>
              <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <!--Attribute   :Context; Required
Allowable Values: As a child element of an ItemGroupDef element: DomainDescription

Attribute       : Name; Required;
Allowable Values: As a child element of an ItemGroupDef element: DomainDescription

-->
            <xsl:if test="odm:Alias/@Context=''">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
                <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="@OID"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context' value.&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
              </xsl:call-template>
            </xsl:if>

            <xsl:if test="odm:Alias/@Context !='DomainDescription'">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0064&quot;"/>
                <xsl:with-param name="Description"
                                select="&quot;The Alias Context attribute must have a value of 'DomainDescription' for split datasets (when child of ItemGroupDef) and 'nci:ExtCodeID' for CodeList, CodeListItem or EnumeratedItem elements.&quot;"/>
                <xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="@OID"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Invalid Alias Context value&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
              </xsl:call-template>
            </xsl:if>
            <xsl:if test="odm:Alias/@Name =''">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
                <xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
                <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                <xsl:with-param name="ItemID" select="@OID"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
              </xsl:call-template>
            </xsl:if>

            <xsl:variable name="ParentDescriptionValue" select="concat(substring-before(odm:Description/odm:TranslatedText,'-'),'s')"/>
            <xsl:variable name="aliasName" select="odm:Alias/@Name"/>
            <xsl:if test="((odm:Alias/@Context ='DomainDescription') and (not(contains($aliasName,$ParentDescriptionValue))))">
              <xsl:call-template name="ErrorGenaration">
                <xsl:with-param name="ItemID" select="@OID"/>
                <xsl:with-param name="ErrorMessage" select="&quot;Allowable value of Name is Description of Parent Domain&quot;"/>
                <xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef/Alias&quot;"/>
              </xsl:call-template>
            </xsl:if>

          </xsl:otherwise>

        </xsl:choose>

      </xsl:if>
    
  </xsl:when>
  <xsl:otherwise>
    <xsl:if test="odm:Alias">
      <xsl:call-template name="ErrorGenaration">
        <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0063&quot;"/>
        <xsl:with-param name="Description"
                        select="&quot;When used for regulatory submission, the Alias element is required for each ItemGroup that is part of a Domain that has been split into different datasets.&quot;"/>
        <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
        <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
        <xsl:with-param name="ItemID" select="@OID"/>
        <xsl:with-param name="ErrorMessage" select="&quot;Alias is required only for Split Domains&quot;"/>
        <xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
      </xsl:call-template>
    </xsl:if>
    
  </xsl:otherwise>
</xsl:choose>
									
								</xsl:otherwise>
							</xsl:choose>
						
						</xsl:for-each>
					</xsl:otherwise>
				</xsl:choose>

				<!--ItemGroupDef ends -->
        

				<!--Element    : ItemDef  				
				    Requirement: Required

					Cardinality: (Already done in VlaueList, ItemGroupDef)
								 An ItemDef element is required for each ItemOID value 
								 that appears in an ItemRef contained in a MetaDataVersion..-->
				<xsl:for-each select="odm:ItemDef">
          <xsl:variable name="IDdefOriginType" select ="def:Origin/@Type"/>
					<xsl:variable name="itemdefOID" select="@OID"/>
					<xsl:for-each select="*">
						<xsl:if test="((name()!='Description') and (name()!='CodeListRef')and (name()!='def:Origin') and (name()!='def:ValueListRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'ItemDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID') and (name()!='Name')and (name()!='DataType')and(name()!='Length')and (name()!='SASFieldName')and (name()!='def:CommentOID')and (name()!='SignificantDigits')and (name()!='def:DisplayFormat'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ItemDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:Description/*">
						<xsl:if test="((name()!='TranslatedText'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/odm:TranslatedText/@*">
						<xsl:if test="((name()!='xml:lang'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/Description/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:CodeListRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'CodeListRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/CodeListRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:CodeListRef/@*">
						<xsl:if test="((name()!='CodeListOID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'CodeListRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/CodeListRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
          
            <xsl:choose>
              <xsl:when test="def:Origin/@Type='Predecessor'">                
              	<xsl:for-each select="def:Origin/*">          
						<xsl:if test="((name()!='Description'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:Origin'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
              </xsl:when>
              <xsl:otherwise>
                	<xsl:for-each select="def:Origin/*">          
						<xsl:if test="((name()!='def:DocumentRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:Origin'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>              
              </xsl:otherwise>            
            </xsl:choose>
                
				
					<xsl:for-each select="def:Origin/@*">
						<xsl:if test="((name()!='Type'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:Origin'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:Origin/def:DocumentRef/*">
						<xsl:if test="((name()!='def:PDFPageRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
          
          	<xsl:for-each select="def:Origin/odm:Description/*">
						<xsl:if test="((name()!='TranslatedText'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'odm:TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/odm:Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
          <xsl:for-each select="def:Origin/odm:Description/odm:TranslatedText/@*">
						<xsl:if test="((name()!='xml:lang'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element'odm:TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/odm:Description/odm:TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:Origin/def:DocumentRef/@*">
						<xsl:if test="((name()!='leafID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:Origin/def:DocumentRef/def:PDFPageRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:Origin/def:DocumentRef/def:PDFPageRef/@*">
						<xsl:if test="((name()!='PageRefs')and (name()!='Type') and (name()!='FirstPage') and (name()!='LastPage'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:Origin/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:ValueListRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:ValueListRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:ValueListRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:ValueListRef/@*">
						<xsl:if test="((name()!='ValueListOID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$itemdefOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:ValueListRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemDef/def:ValueListRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:variable name="dataType" select="@DataType"/>
					<!--OID Checking for ItemDef-->
					<xsl:choose>
						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'ItemDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:if test="@OID =''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:if test="@OID= following::*/@OID">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0031&quot;"/>
									<xsl:with-param name="Description" select="&quot;The OID attribute for ItemDef element must be unique within a single MetaDataVersion.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="'Duplicate ItemDef OID'"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(@Name)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'ItemDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="@Name =''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(@DataType)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'DataType' must appear on element 'ItemDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="@DataType =''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'DataType' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:variable name="DataTypeValue" select="@DataType"/>
					<xsl:if test="(($DataTypeValue!='text') and ($DataTypeValue!='integer') and ($DataTypeValue!='float') and ($DataTypeValue!='datetime')and ($DataTypeValue!='date') and ($DataTypeValue!='time') and ($DataTypeValue!='partialDate') and ($DataTypeValue!='partialTime') and ($DataTypeValue!='partialDatetime') and ($DataTypeValue!='incompleteDateTime') and ($DataTypeValue!='durationDatetime'))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0075&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;The Data Type attribute for Variable must have a value of 'text', 'integer', 'float', 'datetime', 'date', or 'time' for Define-XML v1.0, and 'text', 'integer', 'float', 'datetime', 'date', 'time', 'partialDate', 'partialTime', 'partialDatetime', 'incompleteDatetime', or 'durationDatetime' for Define-XML v2.0.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Invalid Data Type value for variable&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
						</xsl:call-template>
					</xsl:if>

					<!--Length Required if DataType is “text”, “integer”, or “float -->
					<xsl:choose>
						<xsl:when test="(($dataType='float') or ($dataType='text') or ($dataType='integer'))">
							<xsl:choose>
								<xsl:when test="not(@Length)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0070&quot;"/>
										<xsl:with-param name="Description" select="&quot;The Length attribute is required when DataType is integer, float, or text.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing Length value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@Length =''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0070&quot;"/>
											<xsl:with-param name="Description" select="&quot;The Length attribute is required when DataType is integer, float, or text.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Length value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
              <xsl:if test ="$IDdefOriginType!='Predecessor'">
							<xsl:if test="@Length !=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0068&quot;"/>
									<xsl:with-param name="Description" select="&quot;The Length attribute must be empty when DataType is not integer, float, or text.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Invalid use of Length.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
                </xsl:if>
						</xsl:otherwise>
					</xsl:choose>


					<xsl:choose>
						<xsl:when test="$dataType='float'">
							<!--DisplayFormat Checking--> 
              
              <!--DisplayFormat - Deleted Since its Optional-->
							
							<!--SignificantDigits Checking-->
							<xsl:choose>
								<xsl:when test="not(@SignificantDigits)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0071&quot;"/>
										<xsl:with-param name="Description" select="&quot;The Length attribute is required when DataType is integer, float, or text.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing SignificantDigits value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="@SignificantDigits=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0071&quot;"/>
											<xsl:with-param name="Description" select="&quot;The Length attribute is required when DataType is integer, float, or text.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing SignificantDigits value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@SignificantDigits !=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0069&quot;"/>
									<xsl:with-param name="Description" select="&quot;The Significant Digits attribute must be empty when DataType is not float.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Invalid use of Significant Digits&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(@SASFieldName)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0070&quot;"/>
								<xsl:with-param name="Description" select="&quot;For regulatory submission data, SASFieldName attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing 'SASFieldName' value.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="@SASFieldName =''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0070&quot;"/>
										<xsl:with-param name="Description" select="&quot;For regulatory submission data, SASFieldName attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing 'SASFieldName' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
									</xsl:call-template>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>


					<!--chid Element: Description, CodeListRef, def:Origin, def:ValueListRef -->
					<xsl:choose>
						<xsl:when test="not(odm:Description)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0058&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Label field is required for each Variable and must be included in Define.xml and cannot be empty. However, Label field is optional for Value Level metadata. Define-XML specification represents Label as Description/TranslatedText element within ItemDef element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing Label value&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<!--child Element of Description  : TranslatedText
	Requirement: Required 
	Cardinality: One or more.
				Multiple TranslatedText child elements can be used to provide
				the dataset description in different languages. 
				One for each language the description is desired. -->

							<xsl:if test="not(odm:Description/odm:TranslatedText)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0058&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;Label field is required for each Variable and must be included in Define.xml and cannot be empty. However, Label field is optional for Value Level metadata. Define-XML specification represents Label as Description/TranslatedText element within ItemDef element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Label value&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef/odm:Description&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
					<!--Element       : CodeListRef
    Requirement   : Optional 
	Cardinality   : One 
	Business Rule : If a variable or value definition includes Controlled Terminology 
					a CodeList element should be provided as a child element on the ItemDef. 
	Attribute	  : CodeListOID
-->

					<xsl:choose>
						<xsl:when test="count(odm:CodeListRef)&gt;1">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
								<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef/CodeListRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
              <!--this is not in pinnacle-->
							<!--<xsl:if test="odm:CodeListRef">
								<xsl:if test="not(odm:CodeListRef/@CodeListOID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;CodeListOID is Required&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemDef/odm:CodeListRef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:if>-->
						</xsl:otherwise>
					</xsl:choose>

					<!--Element     : def:ValueListRef
	Requirement : Optional
	Cardinality : One 
	Attributes  : ValueListOID
-->

					<xsl:choose>
						<xsl:when test="count(def:ValueListRef)&gt;1">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
								<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef/def:ValueListRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="def:ValueListRef">
								<xsl:choose>
									<xsl:when test="not(def:ValueListRef/@ValueListOID)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ValueListOID' must appear on element 'def:ValueListRef'.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef/def:ValueListRef&quot;"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:if test="def:ValueListRef/@ValueListOID=''">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
												<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'ValueListOID' value.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ItemDef/def:ValueListRef&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<!--Missing Value Level metadata for QVAL in Dataset-->

					<xsl:if test="not(def:ValueListRef)">

						<xsl:if test="((contains(@OID,'.SUPP')) and (contains(@OID,'.QVAL')) and (not(contains(@OID,'.QVAL.'))))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0038&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Value Level metadata must be defined for QVAL variable in each SUPPQUAL dataset. Define-XML specification represents Value Level metadata as def:ValueListDef element, which is referenced from ItemDef/def:ValueListRef element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing Value Level metadata for QVAL in Dataset.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef/def:ValueListRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:if>

					<!--def:Origin-->

					<!--Business Rule: 
									If the ItemDef corresponding to a SDTM, ADaM or SEND variable includes a def:ValueListRef 
									   and all of the ItemDef elements referenced in the corresponding def:ValueListDef include a def:Origin element,
						               the def:Origin is optional with the variable level ItemDef.
							        If the ItemDef corresponding to a SDTM, ADaM or SEND variable includes a def:ValueListRef 
									   and the def:Origin elements of ItemDef elements referenced in the corresponding def:ValueListDef are different,
									   then the def:Origin can not be provided with the variable level ItemDef.-->

					<xsl:if test="not(def:Origin)">
						
						<xsl:choose>
							<xsl:when test="not(def:ValueListRef)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0072&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;For regulatory submission data, Origin is required for all SDTM, ADaM, and SEND variables. It is at the sponsor's discretion whether to provide Origin at the Variable or Value Level. When Origin is provided for each Value Level item, then providing Origin on the Variable is optional. Define-XML specification represents variable Origin as def:Origin element under ItemDef element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Origin&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:variable name="VLRValueListOID" select="def:ValueListRef/@ValueListOID"/>
                <xsl:if test ="$VLRValueListOID!=''">
								<xsl:for-each select="../def:ValueListDef[@OID=$VLRValueListOID]/odm:ItemRef">									
										<xsl:variable name="VLDIRItemOID" select="@ItemOID"/>
                  <xsl:if test ="$VLDIRItemOID!=''">
										<xsl:for-each select="../../odm:ItemDef[@OID=$VLDIRItemOID]">
										
												<xsl:if test="not(def:Origin)">
													<xsl:call-template name="ErrorGenaration">
														<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0072&quot;"/>
														<xsl:with-param name="Description"
														                select="&quot;For regulatory submission data, Origin is required for all SDTM, ADaM, and SEND variables. It is at the sponsor's discretion whether to provide Origin at the Variable or Value Level. When Origin is provided for each Value Level item, then providing Origin on the Variable is optional. Define-XML specification represents variable Origin as def:Origin element under ItemDef element.&quot;"/>
														<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
														<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
														<xsl:with-param name="ItemID" select="@OID"/>
														<xsl:with-param name="ErrorMessage" select="&quot;Missing Origin&quot;"/>
														<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
													</xsl:call-template>
												</xsl:if>
											
										</xsl:for-each>
                    </xsl:if>
									
								</xsl:for-each>
                  </xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>

					<xsl:if test="not(def:Origin)">
						
						<xsl:if test="def:ValueListRef">
							<xsl:variable name="VLRValueListOID" select="def:ValueListRef/@ValueListOID"/>
              <xsl:if test ="$VLRValueListOID!=''">
							<xsl:for-each select="../def:ValueListDef[@OID=$VLRValueListOID]">
								
									<xsl:variable name="allaresame">
										<xsl:for-each select="odm:ItemRef">
											<xsl:variable name="VLDIRItemOID" select="@ItemOID"/>
											<xsl:for-each select="../../odm:ItemDef[@OID=$VLDIRItemOID]/def:Origin">												
													<xsl:if test="@Type= following-sibling::*/@Type">
														<xsl:value-of select="&quot;true &quot;"/>
													</xsl:if>												
											</xsl:for-each>
										</xsl:for-each>
									</xsl:variable>

									<xsl:if test="not(contains($allaresame,'false'))">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0072&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;For regulatory submission data, Origin is required for all SDTM, ADaM, and SEND variables. It is at the sponsor's discretion whether to provide Origin at the Variable or Value Level. When Origin is provided for each Value Level item, then providing Origin on the Variable is optional. Define-XML specification represents variable Origin as def:Origin element under ItemDef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Origin&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
										</xsl:call-template>
									</xsl:if>
								
							</xsl:for-each>
              </xsl:if>
						</xsl:if>
					</xsl:if>

					<xsl:if test="def:Origin">
						
						<xsl:if test="def:ValueListRef">
              
							<xsl:variable name="VLRValueListOID" select="def:ValueListRef/@ValueListOID"/>
              
              <xsl:if test ="$VLRValueListOID!=''">
							<xsl:for-each select="../def:ValueListDef[@OID=$VLRValueListOID]">
								
									<xsl:variable name="allaresame">
										<xsl:for-each select="odm:ItemRef">
											<xsl:variable name="VLDIRItemOID" select="@ItemOID"/>
											<xsl:for-each select="../../odm:ItemDef[@OID=$VLDIRItemOID]/def:Origin">												
												
													<xsl:if test="@Type= following-sibling::*/@Type">
														<xsl:value-of select="&quot;true &quot;"/>
													</xsl:if>
												
											</xsl:for-each>
										</xsl:for-each>
									</xsl:variable>

									<xsl:if test="contains($allaresame,'false')">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0074&quot;"/>
											<xsl:with-param name="Description" select="&quot;When Origin is provided at both the Variable and Value Level, then Origin Type values must match.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="'Variable/Value Level Origin Type mismatch'"/>
											<xsl:with-param name="NodeName" select="&quot;def:ValueListDef/ItemRef&quot;"/>
										</xsl:call-template>
									</xsl:if>

									<xsl:for-each select="odm:ItemRef">
										<xsl:variable name="VLDIRItemOID" select="@ItemOID"/>
                    <xsl:if test ="$VLDIRItemOID!=''">
										<xsl:for-each select="../../odm:ItemDef[@OID=$VLDIRItemOID]">
											
											
												<xsl:if test="not(def:Origin)">
													<xsl:call-template name="ErrorGenaration">
														<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0072&quot;"/>
														<xsl:with-param name="Description"
											                select="&quot;For regulatory submission data, Origin is required for all SDTM, ADaM, and SEND variables. It is at the sponsor's discretion whether to provide Origin at the Variable or Value Level. When Origin is provided for each Value Level item, then providing Origin on the Variable is optional. Define-XML specification represents variable Origin as def:Origin element under ItemDef element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Origin&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
													</xsl:call-template>
												</xsl:if>
											
										</xsl:for-each>
                      </xsl:if>
									</xsl:for-each>
								
							</xsl:for-each>
              </xsl:if>
						</xsl:if>
					</xsl:if>

					<xsl:choose>
						<xsl:when test="count(def:Origin)&gt;1">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
								<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="def:Origin">
								<xsl:choose>
									<xsl:when test="not(def:Origin/@Type)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Type' must appear on element 'def:Origin'.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin&quot;"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
										<xsl:if test="def:Origin/@Type=''">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
												<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Type' value.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin&quot;"/>
											</xsl:call-template>
										</xsl:if>
										<xsl:variable name="TypeValue" select="def:Origin/@Type"/>
										<xsl:if test="(($TypeValue!='CRF') and ($TypeValue!='Derived') and ($TypeValue!='Assigned') and ($TypeValue!='Protocol')and ($TypeValue!='eDT') and ($TypeValue!='Predecessor'))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0073&quot;"/>
												<xsl:with-param name="Description" select="&quot;The Origin Type attribute must have a value of 'CRF', 'Derived', 'Assigned', 'Protocol', 'eDT', or 'Predecessor'.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Invalid Origin Type value&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ItemDef/def:Origin&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<!--Check for Referenced Codelist is missing-->

					<!--<xsl:for-each select="odm:CodeListRef">-->
					<xsl:variable name="CLRCodeListOID" select="odm:CodeListRef/@CodeListOID"/>
<xsl:if test ="$CLRCodeListOID!=''">

					<xsl:variable name="Refcheckoid">
						<xsl:for-each select="../odm:CodeList">
							<xsl:variable name="CLCodeListOID" select="@OID"/>
              <xsl:if test ="$CLCodeListOID!=''">
							<xsl:choose>
								<xsl:when test="$CLRCodeListOID=$CLCodeListOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="(($CLRCodeListOID!='') and (not(contains($Refcheckoid,'true'))))">

						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0048&quot;"/>
							<xsl:with-param name="Description" select="&quot;Referenced Codelist must first be defined on Codelists tab. Define-XML specification represents Codelists as CodeList elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$CLRCodeListOID"/>
							<xsl:with-param name="ErrorMessage" select="'Referenced Codelist is missing'"/>
							<xsl:with-param name="NodeName" select="&quot;ItemDef/CodeListRef&quot;"/>
						</xsl:call-template>
					</xsl:if>
</xsl:if>
					<!--</xsl:for-each>-->
				</xsl:for-each>
				<xsl:text> </xsl:text>

				<!--ItemDef ends-->

				<!--Element  : CodeList-->

				<!--CodeList ends-->

				<!--Element    : MethodDef
    					Requirement: Conditional 
						Cardinality: Required for each unique value of the MethodOID attribute 
						             within the MetaDataVersion
					-->



				<!--Business Rule: Must contain the child Description element or the child def:DocumentRef element-->
				<xsl:for-each select="odm:MethodDef">
					<xsl:variable name="MDOID" select="@OID"/>

					<xsl:for-each select="*">
						<xsl:if test="((name()!='Description') and (name()!='def:DocumentRef')and (name()!='FormalExpression'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'MethodDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID')and (name()!='Name')and (name()!='Type'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'MethodDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:Description/*">
						<xsl:if test="((name()!='TranslatedText'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/odm:TranslatedText/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/Description/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/odm:TranslatedText/@*">
						<xsl:if test="((name()!='xml:lang'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/Description/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:DocumentRef/*">
						<xsl:if test="((name()!='def:PDFPageRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:DocumentRef/@*">
						<xsl:if test="((name()!='leafID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:DocumentRef/def:PDFPageRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:DocumentRef/def:PDFPageRef/@*">
						<!--<xsl:if test="((name()!='PageRefs')and (name()!='Type'))">-->
              <xsl:if test="((name()!='PageRefs')and (name()!='Type') and (name()!='FirstPage') and (name()!='LastPage'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:FormalExpression/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'FormalExpression'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/FormalExpression&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:FormalExpression/@*">
						<xsl:if test="((name()!='Context'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'FormalExpression'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/MethodDef/FormalExpression&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>


					<xsl:choose>
						<xsl:when test="not(odm:Description)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0057&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;For regulatory submission data, Description field is required for each Dataset, Method, and Comment and must be included in Define.xml and cannot be empty. Define-XML specification represents Description as Description/TranslatedText element within ItemGroupDef, MethodDef, or def:CommentDef element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Missing Description value&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<!--child Element of Description  : TranslatedText
	Requirement: Required 
	Cardinality: One or more.
				Multiple TranslatedText child elements can be used to provide
				the dataset description in different languages. 
				One for each language the description is desired. -->

							<xsl:if test="not(odm:Description/odm:TranslatedText)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0057&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;For regulatory submission data, Description field is required for each Dataset, Method, and Comment and must be included in Define.xml and cannot be empty. Define-XML specification represents Description as Description/TranslatedText element within ItemGroupDef, MethodDef, or def:CommentDef element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Description value&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef/odm:Description&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<!--
					    Attributes     : OID, Name, Type 
					    Child Elements : Description, def:DocumentRef, FormalExpression
						-->
					<xsl:choose>
						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="'-'"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'MethodDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@OID=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="'-'"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:if test="@OID= following::*/@OID">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0013&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;The OID attribute for Method (the Method ID) must be unique within Define.xml. Define-XML specification represents Methods as MethodDef elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="'Duplicate Method OID'"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="not(@Name)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attibute 'Name' must appear on element 'MethodDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@Name=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>

						<xsl:when test="not(@Type)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Type' must appear on element 'MethodDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@Type =''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Type' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:variable name="TypeValue" select="@Type"/>
							<xsl:if test="(($TypeValue!='Computation') and ($TypeValue!='Imputation'))">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for Type attribute is Computation,Imputation&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
					<!--FormalExpression-->
					<xsl:if test="FormalExpression">
						<xsl:choose>
							<xsl:when test="not(FormalExpression/@Context)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attibute 'Context' must appear on element 'FormalExpression'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef/FormalExpression&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="FormalExpression/@Context=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;MethodDef/FormalExpression&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>

					<!--Check for Method is not referenced-->

					<xsl:variable name="methodDefOID" select="@OID"/>
          <xsl:if test ="$methodDefOID!=''">
					<xsl:variable name="checkoid">
						<xsl:for-each select="../def:ValueListDef/odm:ItemRef">
							<xsl:variable name="VLDIRmethodOID" select="@MethodOID"/>
              <xsl:if test ="$VLDIRmethodOID!=''">
							<xsl:choose>
								<xsl:when test="$methodDefOID=$VLDIRmethodOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="Mcheckoid">            
						<xsl:for-each select="../odm:ItemGroupDef/odm:ItemRef">
							<xsl:variable name="IGDIRmethodOID" select="@MethodOID"/>
              <xsl:if test ="$IGDIRmethodOID!=''">
                <xsl:choose>
                  <xsl:when test="$methodDefOID=$IGDIRmethodOID">
                    <xsl:value-of select="&quot;true &quot;"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="&quot;false &quot;"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="((not(contains($Mcheckoid,'true'))) and (not(contains($checkoid,'true'))))">

						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0080&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Only Methods that are referenced from a Variable or Value Level metadata should be included in Define.xml. Define-XML specification represents Methods as MethodDef elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
							<xsl:with-param name="ItemID" select="$methodDefOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Method is not referenced.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>
				<xsl:text></xsl:text>

				<!--MethodDef ends-->


				<!--Element Name  : def:CommentDef
    Requirement   : Conditional 
	Cardinality   : Required for each unique value of the def:CommentOID attribute within the MetaDataVersion.
    Business Rule : Must contain the child Description element or the child def:DocumentRef element
-->




				<xsl:for-each select="def:WhereClauseDef">

					<xsl:if test="@def:CommentOID">

						<xsl:variable name="WCDefCommentOID" select="@def:CommentOID"/>
            <xsl:if test="$WCDefCommentOID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:CommentDef ">
								<xsl:variable name="commentDefOID" select="@OID"/>
                <xsl:if test="$commentDefOID!=''">
								<xsl:choose>
									<xsl:when test="$commentDefOID=$WCDefCommentOID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                  </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0071&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Comment must first be defined on Comments tab. Define-XML specification represents Comments as def:CommentDef elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$WCDefCommentOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Comment is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;WhereClauseDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
            </xsl:if>
					</xsl:if>
				</xsl:for-each>


				<xsl:for-each select="odm:ItemGroupDef">
					<xsl:if test="@def:CommentOID">
						<xsl:variable name="IGDDefCommentOID" select="@def:CommentOID"/>

            <xsl:if test ="$IGDDefCommentOID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:CommentDef">
								<xsl:variable name="commentDefOID" select="@OID"/>
                <xsl:if test ="$commentDefOID!=''">
								<xsl:choose>
									<xsl:when test="$commentDefOID=$IGDDefCommentOID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                  </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0071&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Comment must first be defined on Comments tab. Define-XML specification represents Comments as def:CommentDef elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Comment is missing&quot;"/>
								<xsl:with-param name="ItemID" select="$IGDDefCommentOID"/>
								<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
            </xsl:if>
					</xsl:if>
				</xsl:for-each>

				<xsl:for-each select="def:CommentDef">
					<xsl:variable name="CDOID" select="@OID"/>
					<xsl:for-each select="*">
						<xsl:if test="((name()!='Description') and (name()!='def:DocumentRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:CommentDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:CommentDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:Description/*">
						<xsl:if test="((name()!='TranslatedText'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Description'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/Description&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/odm:TranslatedText/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/Description/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Description/odm:TranslatedText/@*">
						<xsl:if test="((name()!='xml:lang'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/Description/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:DocumentRef/*">
						<xsl:if test="((name()!='def:PDFPageRef'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:DocumentRef/@*">
						<xsl:if test="((name()!='leafID'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:DocumentRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/def:DocumentRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:DocumentRef/def:PDFPageRef/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:DocumentRef/def:PDFPageRef/@*">
						<!--<xsl:if test="((name()!='PageRefs')and (name()!='Type'))">-->
              <xsl:if test="((name()!='PageRefs')and (name()!='Type') and (name()!='FirstPage') and (name()!='LastPage'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:PDFPageRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:CommentDef/def:DocumentRef/def:PDFPageRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:choose>

						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="'-'"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'ItemGroupDef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@OID=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="'-'"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:if test="@OID= following::*/@OID">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0083&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;The OID attribute for Comment (the Comment ID) must be unique within Define.xml. Define-XML specification represents Comments as def:CommentDef elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="'Duplicate Comment OID'"/>
									<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>


					<!-- Description and def:DocumentRef -->

					<xsl:choose>
						<xsl:when test="not(odm:Description) and not(def:DocumentRef)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="'Must contain the child Description element or the child def:DocumentRef element'"/>
								<xsl:with-param name="NodeName" select="&quot;def:CommentDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<!--child Element of Description  : TranslatedText
	Requirement: Required 
	Cardinality: One or more.
				Multiple TranslatedText child elements can be used to provide
				the dataset description in different languages. 
				One for each language the description is desired. -->
							<xsl:if test="odm:Description">
								<xsl:if test="not(odm:Description/odm:TranslatedText)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0057&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;For regulatory submission data, Description field is required for each Dataset, Method, and Comment and must be included in Define.xml and cannot be empty. Define-XML specification represents Description as Description/TranslatedText element within ItemGroupDef, MethodDef, or def:CommentDef element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing Description value&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;MethodDef/odm:Description&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
					<!--Check for Comment is not referenced-->

					<xsl:variable name="commentDefOID" select="@OID"/>
          <xsl:if test ="$commentDefOID!=''">
					<xsl:variable name="checkoid">
						<xsl:for-each select="../def:WhereClauseDef">
							<xsl:variable name="WCDdefCommentOID" select="@def:CommentOID"/>
              <xsl:if test ="$WCDdefCommentOID!=''">
							<xsl:choose>
								<xsl:when test="$commentDefOID=$WCDdefCommentOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="Refcheckoid">
						<xsl:for-each select="../odm:ItemGroupDef">
							<xsl:variable name="IGDdefCommentOID" select="@def:CommentOID"/>
              <xsl:if test ="$IGDdefCommentOID!=''">
							<xsl:choose>
								<xsl:when test="$commentDefOID=$IGDdefCommentOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="Reffcheckoid">
						<xsl:for-each select="../odm:ItemDef">
							<xsl:variable name="IDdefCommentOID" select="@def:CommentOID"/>
              <xsl:if test ="$IDdefCommentOID!=''">
							<xsl:choose>
								<xsl:when test="$commentDefOID=$IDdefCommentOID">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="&quot;false &quot;"/>
								</xsl:otherwise>
							</xsl:choose>
                </xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="((not(contains($Refcheckoid,'true'))) and (not(contains($checkoid,'true'))) and (not(contains($Reffcheckoid,'true'))))">

						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0079&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Only Comments that are referenced from a Dataset, Variable or Value Level metadata should be included in Define.xml. Define-XML specification represents Comments as def:CommentDef elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="$commentDefOID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Comment is not referenced.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:CommentDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>
				<xsl:text></xsl:text>
				<!--def:CommentDef ends-->

				<!--Element    :  def:leaf
	Requirement: Required 
	Cardinality: One for each def:DocumentRef or ItemGroupDef included in the define.xml document-->

				<!--def:DocumentRef is Child element of def:AnnotatedCRF, def:SupplementalDoc,ItemDef/def:Origin[@Type='CRF'],def:MethodDef and def:CommentDef-->


				<xsl:for-each select="def:AnnotatedCRF">
					<xsl:if test="def:DocumentRef">
						<xsl:variable name="ACRFleafID" select="def:DocumentRef/@leafID"/>

            <xsl:if test ="$ACRFleafID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:leaf">
								<xsl:variable name="defleafID" select="@ID"/>
                <xsl:if test ="$defleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$ACRFleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                  </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$ACRFleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:AnnotatedCRF&quot;"/>
							</xsl:call-template>
						</xsl:if>
            </xsl:if>
					</xsl:if>
				</xsl:for-each>


				<xsl:for-each select="def:SupplementalDoc">
					<xsl:if test="def:DocumentRef">
						<xsl:variable name="SDleafID" select="def:DocumentRef/@leafID"/>
<xsl:if test ="$SDleafID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:leaf">
								<xsl:variable name="defleafID" select="@ID"/>
                <xsl:if test ="$defleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$SDleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                  </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$SDleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:SupplementalDoc&quot;"/>
							</xsl:call-template>
						</xsl:if>
</xsl:if>
					</xsl:if>
				</xsl:for-each>


				<xsl:for-each select="odm:ItemDef/def:Origin[@Type='CRF']">

					<xsl:variable name="IDOID" select="../@OID"/>
					<xsl:choose>
						<xsl:when test="not(def:DocumentRef)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0075&quot;"/>
								<xsl:with-param name="Description" select="&quot;When def:Origin/@Type is 'CRF', then def:DocumentRef must match the def:DocumentRef in def:AnnotatedCRF element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$IDOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;CRF Origin is not referencing AnnotatedCRF&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:leaf&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:variable name="IDleafID" select="def:DocumentRef/@leafID"/>
<xsl:if test ="$IDleafID!=''">
							<xsl:variable name="checkoid">
								<xsl:for-each select="../../def:leaf">
									<xsl:variable name="defleafID" select="@ID"/>
                  <xsl:if test ="$defleafID!=''">
                  
									<xsl:choose>
										<xsl:when test="$defleafID=$IDleafID">
											<xsl:value-of select="&quot;true &quot;"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="&quot;false &quot;"/>
										</xsl:otherwise>
									</xsl:choose>
                    </xsl:if>
								</xsl:for-each>
							</xsl:variable>

							<xsl:if test="not(contains($checkoid,'true'))">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
									<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="$IDleafID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
  </xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>


				<xsl:for-each select="def:CommentDef">
					<xsl:if test="def:DocumentRef">
						<xsl:variable name="CDleafID" select="def:DocumentRef/@leafID"/>
<xsl:if test ="$CDleafID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:leaf">
								<xsl:variable name="defleafID" select="@ID"/>
                <xsl:if test ="$defleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$CDleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                  </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CDleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;def:CommentDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>


				<xsl:for-each select="odm:MethodDef">
					<xsl:if test="def:DocumentRef">
						<xsl:variable name="MDleafID" select="def:DocumentRef/@leafID"/>
<xsl:if test ="$MDleafID!=''">
						<xsl:variable name="checkoid">
							<xsl:for-each select="../def:leaf">
								<xsl:variable name="defleafID" select="@ID"/>
                <xsl:if test ="$defleafID!=''">
                  <xsl:choose>
                    <xsl:when test="$defleafID=$MDleafID">
                      <xsl:value-of select="&quot;true &quot;"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="&quot;false &quot;"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:if>
							</xsl:for-each>
						</xsl:variable>


						<xsl:if test="not(contains($checkoid,'true'))">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$MDleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;MethodDef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:if>
            </xsl:if>
				</xsl:for-each>

				<xsl:for-each select="odm:ItemGropDef">
					<xsl:choose>
						<xsl:when test="not(def:leaf)">

							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
								<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:if test="count(def:leaf)&gt;1">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
									<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/def:leaf&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:choose>
								<xsl:when test="not(def:leaf/@ID)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ID' must appear on element 'def:leaf'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/def:leaf&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="def:leaf/@ID=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'ID' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/def:leaf&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>


							<xsl:choose>
								<xsl:when test="not(def:leaf/@xlink:href)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0084&quot;"/>
										<xsl:with-param name="Description" select="&quot;Referenced File must exist. Define-XML specification represents File references as xlink:href attributes within def:leaf element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Referenced File is missing.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/def:leaf&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="def:leaf/@xlink:href=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0084&quot;"/>
											<xsl:with-param name="Description" select="&quot;Referenced File must exist. Define-XML specification represents File references as xlink:href attributes within def:leaf element.&quot;"/>
											<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Referenced File is missing.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/def:leaf&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>




							<xsl:variable name="IGDleafID" select="def:leaf/@ID"/>
<xsl:if test ="$IGDleafID!=''">
							<xsl:variable name="checkoid">
								<xsl:for-each select="../def:leaf">
									<xsl:variable name="defleafID" select="@ID"/>
                  <xsl:if test ="$defleafID!=''">
									<xsl:choose>
										<xsl:when test="$defleafID=$IGDleafID">
											<xsl:value-of select="&quot;true &quot;"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="&quot;false &quot;"/>
										</xsl:otherwise>
									</xsl:choose>
                    </xsl:if>
								</xsl:for-each>
							</xsl:variable>


							<xsl:if test="not(contains($checkoid,'true'))">

								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0015&quot;"/>
									<xsl:with-param name="Description" select="&quot;Referenced Document must first be defined on Documents tab. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;CrossReference&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="$IGDleafID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Referenced Document is missing&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGropDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
  </xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>

				<xsl:for-each select="def:leaf">
					<xsl:variable name="defleafID" select="@ID"/>
					<xsl:for-each select="*">
						<xsl:if test="((name()!='def:title'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$defleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:leaf'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:leaf&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='ID')and (name()!='xlink:href'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$defleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:leaf'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:leaf&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="def:title/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$defleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'def:title'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:leaf/def:title&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="def:title/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$defleafID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'def:title'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/def:leaf/def:title&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:if test="@ID= following::*/@ID">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0012&quot;"/>
							<xsl:with-param name="Description" select="&quot;The ID attribute for Document must be unique within Define.xml. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@ID"/>
							<xsl:with-param name="ErrorMessage" select="'Duplicate Document ID'"/>
							<xsl:with-param name="NodeName" select="&quot;def:leaf&quot;"/>
						</xsl:call-template>
					</xsl:if>

					<!--Check for Document is not referenced-->

					<xsl:variable name="checkoid">
						<xsl:for-each select="../def:CommentDef">
							<xsl:if test="def:DocumentRef">
								<xsl:variable name="CDleafID" select="def:DocumentRef/@leafID"/>
                <xsl:if test ="$CDleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$CDleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                </xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="Refcheckoid">
						<xsl:for-each select="../odm:MethodDef">
							<xsl:if test="def:DocumentRef">
								<xsl:variable name="MDleafID" select="def:DocumentRef/@leafID"/>
                <xsl:if test ="$MDleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$MDleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                </xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:variable name="Reffcheckoid">
						<xsl:for-each select="../odm:ItemDef">
							<xsl:if test="def:Origin[@Type='CRF']/def:DocumentRef">
								<xsl:variable name="IDleafID" select="def:Origin/def:DocumentRef/@leafID"/>
                <xsl:if test ="$IDleafID!=''">
								<xsl:choose>
									<xsl:when test="$defleafID=$IDleafID">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
                </xsl:if>
							</xsl:if>
						</xsl:for-each>
					</xsl:variable>

					<xsl:if test="((not(contains($Refcheckoid,'true'))) and (not(contains($checkoid,'true'))) and (not(contains($Reffcheckoid,'true'))))">


						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0078&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Only Documents that are referenced from a Method or Comment should be included in Define.xml. Define-XML specification represents Documents as def:leaf elements within MetaDataVersion element.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
							<xsl:with-param name="ItemID" select="$defleafID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Document is not referenced.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;def:leaf&quot;"/>
						</xsl:call-template>
					</xsl:if>
				</xsl:for-each>

				<!--def:leaf ends-->


				<!--Element    : CodeList
    Requirement: Conditional 
	Cardinality: A CodeList element must be provided for each distinct value of the CodelistOID attribute
	            in a CodeListRef element in the MetaDataVersion
-->
				<xsl:for-each select="odm:CodeList">

					<xsl:variable name="CLOID" select="@OID"/>

					<xsl:for-each select="*">
						<xsl:if test="((name()!='EnumeratedItem') and (name()!='Alias')and (name()!='CodeListItem') and (name()!='ExternalCodeList'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'CodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="@*">
						<xsl:if test="((name()!='OID') and (name()!='Name')and (name()!='DataType') and (name()!='SASFormatName'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'CodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList&quot;"/>
							</xsl:call-template>
						</xsl:if>
						<xsl:if test="(string-length(name())&gt;1000)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0086&quot;"/>
								<xsl:with-param name="Description" select="&quot;FDA's Clinical Trial Repository (CTR) software currently has a maximum length of 1000 characters for data attributes in Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Structure&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="name()"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid length of attributes in Define.xml&quot;"/>
								<xsl:with-param name="NodeName" select="name(parent::*)"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:EnumeratedItem/*">
						<xsl:if test="((name()!='Alias'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'EnumeratedItem'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/EnumeratedItem&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:EnumeratedItem/@*">
						<xsl:if test="((name()!='CodedValue') and (name()!='OrderNumber')and (name()!='def:ExtendedValue') and (name()!='Rank'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'EnumeratedItem'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/EnumeratedItem&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:EnumeratedItem/odm:Alias/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/EnumeratedItem/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:EnumeratedItem/odm:Alias/@*">
						<xsl:if test="((name()!='Name') and (name()!='Context'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/EnumeratedItem/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:Alias/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:Alias/@*">
						<xsl:if test="((name()!='Name') and (name()!='Context'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:CodelistItem/*">
						<xsl:if test="((name()!='Alias') and (name()!='Decode'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'CodeListItem'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:CodelistItem/@*">
						<xsl:if test="((name()!='CodedValue') and (name()!='OrderNumber')and (name()!='def:ExtendedValue') and (name()!='Rank'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'CodeListItem'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:CodelistItem/odm:Decode/*">
						<xsl:if test="((name()!='TranslatedText'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Decode'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Decode&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:CodelistItem/odm:Decode/@*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Decode'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Decode&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:CodelistItem/odm:Decode/odm:TranslatedText/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Decode/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:CodelistItem/odm:Decode/odm:TranslatedText/@*">
						<xsl:if test="((name()!='xml:lang'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'TranslatedText'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Decode/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>

						<xsl:if test="@xml:lang != following-sibling::*/@xml:lang">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0062&quot;"/>
								<xsl:with-param name="Description" select="&quot;The xml:lang attribute for TranslatedText element must be unique within a single parent element.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="'Duplicate xml:lang'"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Decode/TranslatedText&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:CodelistItem/odm:Alias/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:CodelistItem/odm:Alias/@*">
						<xsl:if test="((name()!='Name') and (name()!='Context'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'Alias'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/CodeListItem/Alias&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:for-each select="odm:ExternalCodeList/*">
						<xsl:if test="((name()!=''))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description" select="&quot;An element was found in the wrong position within Define.xml.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Element in wrong position within 'ExternalCodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/ExternalCodeList&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="odm:ExternalCodeList/@*">
						<xsl:if test="((name()!='Dictionary')and (name()!='Version'))">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0007&quot;"/>
								<xsl:with-param name="Description"
								                select="&quot;Define.xml must only contain elements that are defined in either ODM or Define-XML specifications. The elements must also follow the cardinality and order specified in the specifications.&quot;"/>
								<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="$CLOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Invalid content was found starting with element 'ExternalCodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/CodeList/ExternalCodeList&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>

					<xsl:choose>
						<xsl:when test="not(@OID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="'-'"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'OID' must appear on element 'CodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@OID=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="'-'"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'OID' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:if test="@OID= following::*/@OID">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0032&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;The OID attribute for CodeList (the CodeList ID) must be unique within Define.xml. Define-XML specification represents Codelists as CodeList elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="'Duplicate Codelist OID'"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<!--  check for Codelist is not referenced -->

							<xsl:variable name="CodeListOID" select="@OID"/>
<xsl:if test ="$CodeListOID!=''">
							<xsl:variable name="checkoid">
								<xsl:for-each select="../odm:ItemDef/odm:CodeListRef">
									<xsl:variable name="CLRCodeListOID" select="@CodeListOID"/>
                  <xsl:if test="$CLRCodeListOID!=''">
									<xsl:choose>
										<xsl:when test="$CLRCodeListOID=$CodeListOID">
											<xsl:value-of select="&quot;true &quot;"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="&quot;false &quot;"/>
										</xsl:otherwise>
									</xsl:choose>
                    </xsl:if>
								</xsl:for-each>
							</xsl:variable>


							<xsl:if test="not(contains($checkoid,'true'))">

								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0082&quot;"/>
									<xsl:with-param name="Description"
									                select="&quot;Only Codelists that are referenced from a Variable or Value Level metadata should be included in Define.xml. Define-XML specification represents Codelists as CodeList elements within MetaDataVersion element.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
									<xsl:with-param name="ItemID" select="$CodeListOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Codelist is not referenced.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>
  </xsl:if>



							<xsl:variable name="CLDataType" select="@DataType"/>
							<xsl:for-each select="../odm:ItemDef/odm:CodeListRef">
								<xsl:variable name="IDDataType" select="../@DataType"/>
								<xsl:variable name="CLRCodeListOID" select="@CodeListOID"/>

								<xsl:if test="$CLRCodeListOID=$CodeListOID">
									<xsl:if test="$CLDataType != $IDDataType">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0080&quot;"/>
											<xsl:with-param name="Description" select="&quot;Variable Data Type must match the Data Type of the referenced Codelist. Define-XML specification represents Variable as ItemDef.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="$CodeListOID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Variable Data Type mismatch.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:choose>
						<xsl:when test="not(@Name)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'CodeList'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@Name=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(@DataType)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@OID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'DataType' must appear on element 'CodeList'&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:if test="@DataType=''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing reuired 'DataType' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:variable name="DataTypeValue" select="@DataType"/>
							<xsl:if test="(($DataTypeValue!='text') and ($DataTypeValue!='float')and ($DataTypeValue!='integer'))">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0076&quot;"/>
									<xsl:with-param name="Description" select="&quot;The Data Type attribute for Codelist must have a value of 'text, 'integer', or 'float'.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Invalid Data Type value for codelist.&quot;"/>


									<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
								</xsl:call-template>
							</xsl:if>
							<!--Business Rules:
								The SASFormatName must be a legal SAS format.
								The SASFormatName needs to start with a “$” character in case the CodeList DataType is “text”.-->

							<!-- <xsl:if test="@SASFormatName">
								<xsl:if test="string-length() != ((string-length(translate(@SASFormatName,$vAlpha,''))) or (string-length() != string-length(translate(@SASFormatName,$vAlphaNumeric,''))))">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0019&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;Attribute is defined as a sasFormat, but value does not match the SAS Format naming conventions. Allowed string pattern for a sasFormat is '(letter|_|$)(letter|digit|_|.)*'.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Format&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid SASFormatName value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:if> -->

							<xsl:if test="$DataTypeValue ='text'">
								<xsl:if test="@SASFormatName">
									<xsl:variable name="sasformantname" select="@SASFormatName"/>
									<xsl:variable name="startingchar" select="substring($sasformantname,1,1)"/>

									<xsl:if test="$startingchar!= '$'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0078&quot;"/>
											<xsl:with-param name="Description" select="&quot;When CodeList DataType is 'text' the SASFormatName should start with a '$'.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Format&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid SASFormatName value for text Codelist .&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:if>
							</xsl:if>

							<xsl:if test="$DataTypeValue ='text'">
								<xsl:if test="odm:EnumeratedItem">
									<xsl:for-each select="odm:EnumeratedItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="number(@CodedValue)=@CodedValue">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>
								<xsl:if test="odm:CodeListItem">
									<xsl:for-each select="odm:CodeListItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="number(@CodedValue)=@CodedValue">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>
							</xsl:if>

							<xsl:if test="$DataTypeValue ='integer'">
								<xsl:if test="odm:EnumeratedItem">
									<xsl:for-each select="odm:EnumeratedItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="number(@CodedValue)!=@CodedValue">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>

								<xsl:if test="odm:CodeListItem">
									<xsl:for-each select="odm:CodeListItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="number(@CodedValue)!=@CodedValue">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>
							</xsl:if>

							<xsl:if test="$DataTypeValue ='float'">
								<xsl:if test="odm:EnumeratedItem">
									<xsl:for-each select="odm:EnumeratedItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="((number(@CodedValue)!=@CodedValue) and (contains(@CodedValue,'.')))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>

								<xsl:if test="odm:CodeListItem">
									<xsl:for-each select="odm:CodeListItem">

										<xsl:variable name="codedvalue" select="@CodedValue"/>
										<xsl:if test="((number(@CodedValue)!=@CodedValue) and (contains(@CodedValue,'.')))">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0077&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;Codelist Term must match the Data Type of the containing CodeList. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Format&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
												<xsl:with-param name="ItemID" select="../@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Codelist/Term Data Type mismatch.&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:for-each>
								</xsl:if>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:if test="not(odm:EnumeratedItem) and not(odm:CodeListItem) and not(odm:ExternalCodeList)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0081&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Codelist must have at least one item. Define-XML specification allows Codelists to contain 3 types of items: 1) list of Terms (EnumeratedItem); 2) list of Terms and Decoded Values (CodeListItem); 3) or a reference to external dictionary (ExternalCodeList).&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Codelist is empty.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:if test="odm:EnumeratedItem and odm:CodeListItem and odm:ExternalCodeList">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0082&quot;"/>
							<xsl:with-param name="Description" select="&quot;When Codelist contains at least one item with Term and Decoded Value (CodeListItem), then all other items must be of the same type.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Codelist is missing Decoded Values.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
						</xsl:call-template>
					</xsl:if>

					<xsl:if test="(odm:EnumeratedItem and (odm:CodeListItem or odm:ExternalCodeList)) or (odm:CodeListItem and (odm:EnumeratedItem or odm:ExternalCodeList)) or(odm:ExternalCodeList and (odm:EnumeratedItem or odm:CodeListItem))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0082&quot;"/>
							<xsl:with-param name="Description" select="&quot;When Codelist contains at least one item with Term and Decoded Value (CodeListItem), then all other items must be of the same type.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Codelist is missing Decoded Values.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;CodeList&quot;"/>
						</xsl:call-template>
					</xsl:if>


					<xsl:variable name="EIcount" select="count(odm:EnumeratedItem)"/>
					<xsl:variable name="EIwithRankcount" select="count(odm:EnumeratedItem/@Rank)"/>
					<xsl:variable name="EIwithORcount" select="count(odm:EnumeratedItem/@OrderNumber)"/>
					<xsl:variable name="EIwithoutAliascount" select="count(*[not(odm:EnumeratedItem/odm:Alias)])"/>

					<!--EnumeratedItem-->

					<xsl:for-each select="odm:EnumeratedItem">

						<xsl:choose>
							<xsl:when test="not(@CodedValue)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'CodedValue' must appear on element 'EnumeratedItem'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="@CodedValue=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'CodedValue' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
									</xsl:call-template>
								</xsl:if>

								<xsl:if test="@CodedValue = following-sibling::*/@CodedValue">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0079&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;The Term must be unique within a Codelist. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="'Duplicate Term in Codelist'"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

						<xsl:if test="@Rank">
							<xsl:variable name="checkcount">
								<xsl:if test="$EIwithRankcount != $EIcount">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:if>
							</xsl:variable>
              <xsl:variable name="rankvalue">
                
                  <xsl:value-of select="@Rank"/>
       
              </xsl:variable>
							<xsl:if test="contains($checkcount,'true')">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0076&quot;"/>
									<xsl:with-param name="Description" select="&quot;If Rank value is provided for any Codelist item (EnumeratedItem or CodeListItem) within a Codelist, it must be provided for all other items as well.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Rank value&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
								</xsl:call-template>
							</xsl:if>
              <!-- 
                    to test the value is numeric or not
                  -->
     
                  <xsl:if test="((string-length($rankvalue) &gt; 0) and (string(number($rankvalue)) = 'NaN')) ">

                    <xsl:call-template name="ErrorGenaration">
                      <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                      <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                      <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                      <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                      <xsl:with-param name="ItemID" select="../@OID"/>
                      <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                      <xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
                    </xsl:call-template>

                  </xsl:if>
              
						</xsl:if>

						<xsl:if test="@OrderNumber">
							<xsl:variable name="checkcount">
								<xsl:if test="$EIwithORcount != $EIcount">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:if>
							</xsl:variable>
							<xsl:if test="contains($checkcount,'true')">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0077&quot;"/>
									<xsl:with-param name="Description" select="&quot;If Order number is provided for any Codelist item (EnumeratedItem or CodeListItem) within a Codelist, it must be provided for all other items as well.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Order number.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
								</xsl:call-template>
							</xsl:if>

              <xsl:variable name="ordervalue">

                <xsl:value-of select="@OrderNumber"/>

              </xsl:variable>
              <!-- 
                    to test the value is numeric or not
                  -->

              <xsl:if test="((string-length($ordervalue) &gt; 0) and (string(number($ordervalue)) = 'NaN')) ">

                <xsl:call-template name="ErrorGenaration">
                  <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                  <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                  <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                  <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                  <xsl:with-param name="ItemID" select="../@OID"/>
                  <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                  <xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
                </xsl:call-template>

              </xsl:if>


            </xsl:if>
						<xsl:if test="@OrderNumber= following-sibling::*/@OrderNumber">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0042&quot;"/>
								<xsl:with-param name="Description" select="&quot;The Order number attribute must be unique.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="../@OID"/>
								<xsl:with-param name="ErrorMessage" select="'Duplicate Order Number'"/>
								<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
							</xsl:call-template>
						</xsl:if>

						<xsl:if test="not(odm:Alias)">
							<xsl:choose>
								<xsl:when test="not(@def:ExtendedValue)">
									<xsl:if test="$EIcount != $EIwithoutAliascount">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0029&quot;"/>
											<xsl:with-param name="Description" select="&quot;The def:ExtendedValue attribute is required when the CodedValue is an extended value.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Required attribute def:ExtendedValue is missing or empty.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:when>
								<xsl:otherwise>

									<xsl:variable name="ExtendedValue" select="@def:ExtendedValue"/>
									<xsl:if test="($ExtendedValue !='Yes')">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0030&quot;"/>
											<xsl:with-param name="Description" select="&quot;The def:ExtendedValue attribute must have a value of 'Yes'.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid def:ExtendedValue value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>


						<!--
					Element     :Alias
						Attribute   :Context; Required
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: nci:ExtCodeID

Attribute       : Name; Required;
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: C-Code for corresponding CDISC Controlled Terminology Term

-->

						<xsl:if test="odm:Alias">
							<xsl:choose>
								<xsl:when test="not(odm:Alias/@Context)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Context' must appear on element 'Alias'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="odm:Alias/@Context=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context'value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="odm:Alias/@Context !='nci:ExtCodeID'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0064&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;The Alias Context attribute must have a value of 'DomainDescription' for split datasets (when child of ItemGroupDef) and 'nci:ExtCodeID' for CodeList, CodeListItem or EnumeratedItem elements.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid Alias Context value&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>
								<xsl:when test="not(odm:Alias/@Name)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'Alias'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="odm:Alias/@Name=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing Required 'Name' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:variable name="aliasName" select="odm:Alias/@Name"/>
									<xsl:variable name="CcodedValue" select="substring($aliasName,1,1)"/>
                  <xsl:variable name ="aliascontext" select ="odm:Alias/@Context"/>
									<xsl:if test="$CcodedValue !='C' and  $aliascontext ='nci:ExtCodeID'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="ItemID" select="$CcodedValue"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Allowable value of Name is C-Code for corresponding CDISC Controlled Terminology Term.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/EnumeratedItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>
					</xsl:for-each>


					<!--CodeListItem-->

					<xsl:variable name="CLIcount" select="count(odm:CodeListItem)"/>
					<xsl:variable name="CLIwithRankcount" select="count(odm:CodeListItem/@Rank)"/>
					<xsl:variable name="CLIwithORcount" select="count(odm:CodeListItem/@OrderNumber)"/>
					<xsl:variable name="CLIwithoutAliascount" select="count(*[not(odm:CodeListItem/odm:Alias)])"/>


					<xsl:for-each select="odm:CodeListItem">
						<xsl:choose>
							<xsl:when test="not(@CodedValue)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'CodedValue' must appear on element 'CodeListItem'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="@CodedValue=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'CodedValue' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
									</xsl:call-template>
								</xsl:if>

								<xsl:if test="@CodedValue = following-sibling::*/@CodedValue">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0079&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;The Term must be unique within a Codelist. Define-XML specification represents Term as CodedValue attribute on either EnumeratedItem or CodeListItem elements within CodeList element.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="'Duplicate Term in Codelist'"/>
										<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

						<xsl:if test="@Rank">
							<xsl:variable name="checkcount">
								<xsl:if test="$CLIwithRankcount != $CLIcount">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:if>
							</xsl:variable>
							<xsl:if test="contains($checkcount,'true')">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0076&quot;"/>
									<xsl:with-param name="Description" select="&quot;If Rank value is provided for any Codelist item (EnumeratedItem or CodeListItem) within a Codelist, it must be provided for all other items as well.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Rank value&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
								</xsl:call-template>
							</xsl:if>

              <xsl:variable name="rankvalue">

                <xsl:value-of select="@Rank"/>

              </xsl:variable>

              <!-- 
                    to test the value is numeric or not
                  -->

              <xsl:if test="((string-length($rankvalue) &gt; 0) and (string(number($rankvalue)) = 'NaN')) ">

                <xsl:call-template name="ErrorGenaration">
                  <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                  <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                  <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                  <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                  <xsl:with-param name="ItemID" select="../@OID"/>
                  <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                  <xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
                </xsl:call-template>

              </xsl:if>
              
              
						</xsl:if>

						<xsl:if test="@OrderNumber">
							<xsl:variable name="checkcount">
								<xsl:if test="$CLIwithORcount != $CLIcount">
									<xsl:value-of select="&quot;true &quot;"/>
								</xsl:if>
							</xsl:variable>
							<xsl:if test="contains($checkcount,'true')">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0077&quot;"/>
									<xsl:with-param name="Description" select="&quot;If Order number is provided for any Codelist item (EnumeratedItem or CodeListItem) within a Codelist, it must be provided for all other items as well.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Order number.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
								</xsl:call-template>
							</xsl:if>

              <xsl:variable name="ordervalue">

                <xsl:value-of select="@OrderNumber"/>

              </xsl:variable>
              <!-- 
                    to test the value is numeric or not
                  -->

              <xsl:if test="((string-length($ordervalue) &gt; 0) and (string(number($ordervalue)) = 'NaN')) ">

                <xsl:call-template name="ErrorGenaration">
                  <xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0013&quot;"/>
                  <xsl:with-param name="Description" select="&quot;Attribute is defined as an integer, but value does not match the integer format. Allowed string pattern for an integer is '-?digit+'.	&quot;"/>
                  <xsl:with-param name="Category" select="&quot;Presence&quot;"/>
                  <xsl:with-param name="Severity" select="&quot;Error&quot;"/>
                  <xsl:with-param name="ItemID" select="../@OID"/>
                  <xsl:with-param name="ErrorMessage" select="&quot;Invalid integer value.&quot;"/>
                  <xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
                </xsl:call-template>

              </xsl:if>


            </xsl:if>

						<xsl:if test="@OrderNumber= following-sibling::*/@OrderNumber">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0042&quot;"/>
								<xsl:with-param name="Description" select="&quot;The Order number attribute must be unique.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="../@OID"/>
								<xsl:with-param name="ErrorMessage" select="'Duplicate Order Number'"/>
								<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
							</xsl:call-template>
						</xsl:if>

						<xsl:if test="not(odm:Alias)">
							<xsl:choose>
								<xsl:when test="not(def:ExtendedValue)">
									<xsl:if test="$CLIcount != $CLIwithoutAliascount and not(../odm:Alias)">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="ItemID" select="concat($CLIcount,'_',$CLIwithoutAliascount)"/>
											<xsl:with-param name="ErrorMessage" select="&quot;def:ExtendedValue is Required when the CodedValue is an extended value&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:when>
								<xsl:otherwise>
                  
									<xsl:variable name="ExtendedValue" select="@def:ExtendedValue"/>
									<xsl:if test="$ExtendedValue!='Yes'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Allowable Values for def:ExtendedValue attribute is 'yes'&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>



						<!--
						Element     :Alias
						Attribute   :Context; Required
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: nci:ExtCodeID

Attribute       : Name; Required;
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: C-Code for corresponding CDISC Controlled Terminology Term

-->

						<xsl:if test="odm:Alias">
							<xsl:choose>
								<xsl:when test="not(odm:Alias/@Context)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Context' must appear on element 'Alias'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="odm:Alias/@Context=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context'value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:if test="odm:Alias/@Context !='nci:ExtCodeID'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0064&quot;"/>
											<xsl:with-param name="Description"
											                select="&quot;The Alias Context attribute must have a value of 'DomainDescription' for split datasets (when child of ItemGroupDef) and 'nci:ExtCodeID' for CodeList, CodeListItem or EnumeratedItem elements.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Invalid Alias Context value&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>

							<xsl:choose>
								<xsl:when test="not(odm:Alias/@Name)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'Alias'.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
									</xsl:call-template>
								</xsl:when>
								<xsl:otherwise>
									<xsl:if test="odm:Alias/@Name=''">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
											<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
									<xsl:variable name="aliasName" select="odm:Alias/@Name"/>
									<xsl:variable name="CcodedValue" select="substring($aliasName,1,1)"/>
                  <xsl:variable name ="aliascontext" select ="odm:Alias/@Context"/>									
									<xsl:if test="$CcodedValue !='C' and  $aliascontext ='nci:ExtCodeID'">
										<xsl:call-template name="ErrorGenaration">
											<xsl:with-param name="ItemID" select="../@OID"/>
											<xsl:with-param name="ErrorMessage" select="&quot;Allowable value of Name is C-Code for corresponding CDISC Controlled Terminology Term.&quot;"/>
											<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListItem/Alias&quot;"/>
										</xsl:call-template>
									</xsl:if>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:if>

						<!--   Element    :Decode
       Requirement: Required 
       Cardinality: One
       (5.3.12.3)

-->
						<xsl:choose>

							<xsl:when test="not(odm:Decode)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@CodedValue"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Decode' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/CodelistItem&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="count(odm:Decode)&gt;1">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0009&quot;"/>
										<xsl:with-param name="Description" select="&quot;Element occurs in Define.xml more than once, but it is limited to only one occurrence by the specification.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Element occurs more than once&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodelistItem/Decode&quot;"/>
									</xsl:call-template>
								</xsl:if>

								<!--Element    : TranslatedText
	Requirement: Required 
	Cardinality: One or more.
				Multiple TranslatedText child elements can be used to provide
				the dataset description in different languages. 
				One for each language the description is desired.
-->

								<xsl:if test="not(odm:Decode/odm:TranslatedText)">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;TranslatedText is Required&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/CodeListitem/Decode&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>

					<!--ExternalCodeList-->
					<xsl:for-each select="odm:ExternalCodeList">
						<xsl:choose>
							<xsl:when test="not(@Dictionary)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Dictionary' must appear on element 'ExternalCodeList'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/ExternalCodeList&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="@Dictionary=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Dictionary' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/ExternalCodeList&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

						<xsl:choose>
							<xsl:when test="not(@Version)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="../@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Version' must appear on element 'ExternalCodeList'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/ExternalCodeList&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="@Version=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="../@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Version' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/ExternalCodeList&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>

					<!--
						Element     :Alias
						Attribute   :Context; Required
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: nci:ExtCodeID

Attribute       : Name; Required;
Allowable Values: As a child element of an CodeList,CodeListItem,EnumeratedItem elements: C-Code for corresponding CDISC Controlled Terminology Term

-->
					<xsl:if test="odm:Alias">

						<xsl:choose>
							<xsl:when test="not(odm:Alias/@Context)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Context' must appear on element 'Alias'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="odm:Alias/@Context=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Context' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:if test="odm:Alias/@Context !='nci:ExtCodeID'">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0064&quot;"/>
										<xsl:with-param name="Description"
										                select="&quot;The Alias Context attribute must have a value of 'DomainDescription' for split datasets (when child of ItemGroupDef) and 'nci:ExtCodeID' for CodeList, CodeListItem or EnumeratedItem elements.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Terminalogy&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid Alias Context value&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>

						<xsl:choose>
							<xsl:when test="not(odm:Alias/@Name)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Name' must appear on element 'Alias'.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="odm:Alias/@Name=''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Name' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
									</xsl:call-template>
								</xsl:if>
								<xsl:variable name="aliasName" select="odm:Alias/@Name"/>
								<xsl:variable name="CcodedValue" select="substring($aliasName,1,1)"/>
                <xsl:variable name ="aliascontext" select ="odm:Alias/@Context"/>			
								<xsl:if test="$CcodedValue !='C' and  $aliascontext ='nci:ExtCodeID'">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Allowable value of Name is C-Code for corresponding CDISC Controlled Terminology Term.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;CodeList/Alias&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:if>
					<!--Alias ends-->
				</xsl:for-each>
				<!--CodeList ends-->

				<xsl:for-each select="odm:ItemGroupDef">
					<xsl:variable name="IRwithKeySeq">
						<xsl:value-of select="count(odm:ItemRef[@KeySequence])"/>
					</xsl:variable>
					<xsl:if test="(($IRwithKeySeq)&lt;1)">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0040&quot;"/>
							<xsl:with-param name="Description"
							                select="&quot;Key Variables must be defined for each dataset. Define-XML specification represents Key Variables as KeySequence attribute on ItemRef element. The KeySequence attribute must be provided for at least one ItemRef within each ItemGroupDef.&quot;"/>
							<xsl:with-param name="Category" select="&quot;MetaData&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Missing Key Variables value&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
						</xsl:call-template>
					</xsl:if>

					<!--For SDTM and SEND submission data (where def:StandardName is 'SDTM-IG' or 'SEND-IG'), Domain attribute is required and must be included in Define.xml and cannot be empty.-->

					<xsl:choose>
						<xsl:when test="(($defStandardName = 'SDTM-IG') or ($defStandardName = 'SEND-IG')) ">
							<xsl:if test="not(@Domain)">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0045&quot;"/>
									<xsl:with-param name="Description" select="&quot;For SDTM and SEND submission data (where def:StandardName is 'SDTM-IG' or 'SEND-IG'), Domain attribute is required and must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@OID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing Domain value&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:variable name="Namevalue" select="@Name"/>
							<xsl:variable name="Domainvalue" select="@Domain"/>
							<xsl:variable name="SASDatasetNamevalue" select="@SASDatasetName"/>

							<xsl:choose>
								<xsl:when test="@Domain= following::*/@Domain">
									<xsl:variable name="dubDomain" select="@Domain"/>
									<xsl:if test="@Domain=$dubDomain">										
										<xsl:if test="substring(@SASDatasetName,1,2)!=$dubDomain">
											<xsl:call-template name="ErrorGenaration">
												<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0050&quot;"/>
												<xsl:with-param name="Description"
												                select="&quot;For split datasets (where more than one ItemGroupDef exists for the same Domain), the 2-letter prefix in SASDatasetName attribute and Domain attribute must have the same value.&quot;"/>
												<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
												<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
												<xsl:with-param name="ItemID" select="@OID"/>
												<xsl:with-param name="ErrorMessage" select="&quot;Domain/SASDatasetName mismatch for split dataset&quot;"/>
												<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
											</xsl:call-template>
										</xsl:if>
									</xsl:if>
								</xsl:when>
								<xsl:otherwise>
									<xsl:choose>
										<xsl:when test="@Domain= preceding-sibling::*[1]/@Domain">
											<xsl:variable name="dubDomain" select="@Domain"/>
											<xsl:if test="@Domain=$dubDomain">										
												<xsl:if test="substring(@SASDatasetName,1,2)!=$dubDomain">
													<xsl:call-template name="ErrorGenaration">
														<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0050&quot;"/>
														<xsl:with-param name="Description"
														                select="&quot;For split datasets (where more than one ItemGroupDef exists for the same Domain), the 2-letter prefix in SASDatasetName attribute and Domain attribute must have the same value.&quot;"/>
														<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
														<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
														<xsl:with-param name="ItemID" select="@OID"/>
														<xsl:with-param name="ErrorMessage" select="&quot;Domain/SASDatasetName mismatch for split dataset&quot;"/>
														<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
													</xsl:call-template>
												</xsl:if>
											</xsl:if>
										</xsl:when>

										<xsl:otherwise>
											<xsl:if test="(($Namevalue!=$Domainvalue) or ($Namevalue!=$SASDatasetNamevalue))">
												<xsl:call-template name="ErrorGenaration">
													<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0049&quot;"/>
													<xsl:with-param name="Description"
													                select="&quot;For SDTM and SEND submission data and for datasets that are not SUPPQUAL and not split (where def:StandardName is 'SDTM-IG' or 'SEND-IG' and only one ItemGroupDef exists for the Domain), Name, Domain, and SASDatasetName attributes must have the same value.&quot;"/>
													<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
													<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
													<xsl:with-param name="ItemID" select="@OID"/>
													<xsl:with-param name="ErrorMessage" select="&quot;Name/Domain/SASDatasetName mismatch&quot;"/>
													<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
												</xsl:call-template>
											</xsl:if>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:when>
						<xsl:otherwise>
							<!--For ADaM submission data (where def:StandardName is 'ADaM-IG'), Domain attribute is not applicable and must not be included in Define.xml.-->
							<xsl:if test="($defStandardName = 'ADaM-IG')">
								<xsl:if test="@Domain">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0046&quot;"/>
										<xsl:with-param name="Description" select="&quot;For ADaM submission data (where def:StandardName is 'ADaM-IG'), Domain attribute is not applicable and must not be included in Define.xml.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="@OID"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Invalid use of Domain attribute&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ODM/Study/MetaDataVersion/ItemGroupDef&quot;"/>
									</xsl:call-template>
								</xsl:if>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
					<xsl:variable name="IGDIRcount" select="count(odm:ItemRef)"/>
					<xsl:variable name="IGDIRwithORcount" select="count(odm:ItemRef/@OrderNumber)"/>

					<xsl:if test="(($IGDIRwithORcount&gt;0) and ($IGDIRwithORcount != $IGDIRcount))">
						<xsl:call-template name="ErrorGenaration">
							<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0077&quot;"/>
							<xsl:with-param name="Description" select="&quot;If Order number is provided for any Codelist item (EnumeratedItem or CodeListItem) within a Codelist, it must be provided for all other items as well.&quot;"/>
							<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
							<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
							<xsl:with-param name="ItemID" select="../@OID"/>
							<xsl:with-param name="ErrorMessage" select="&quot;Missing Order number.&quot;"/>
							<xsl:with-param name="NodeName" select="&quot;ItemGroupDef&quot;"/>
						</xsl:call-template>
					</xsl:if>
					<xsl:for-each select="odm:ItemRef">
						<xsl:if test="@OrderNumber= following-sibling::*/@OrderNumber">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0042&quot;"/>
								<xsl:with-param name="Description" select="&quot;The Order number attribute must be unique.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Consistency&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="../@OID"/>
								<xsl:with-param name="ErrorMessage" select="'Duplicate Order Number'"/>
								<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:if>
					</xsl:for-each>
				</xsl:for-each>

				<xsl:for-each select="odm:ItemGroupDef/odm:ItemRef">

					<xsl:variable name="itemRefItemOID" select="@ItemOID"/>

					<!--ItemOID Checking for ItemRef-->
					<xsl:choose>
						<xsl:when test="not(@ItemOID)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'ItemOID' must appear on element 'ItemRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="@ItemOID =''">
									<xsl:call-template name="ErrorGenaration">
										<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
										<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
										<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
										<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
										<xsl:with-param name="ItemID" select="&quot;-&quot;"/>
										<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'ItemOID' value.&quot;"/>
										<xsl:with-param name="NodeName" select="&quot;ItemRef&quot;"/>
									</xsl:call-template>
								</xsl:when>
							</xsl:choose>
						</xsl:otherwise>
					</xsl:choose>

					<xsl:choose>
						<xsl:when test="not(@Mandatory)">
							<xsl:call-template name="ErrorGenaration">
								<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0003&quot;"/>
								<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
								<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
								<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
								<xsl:with-param name="ItemID" select="@ItemOID"/>
								<xsl:with-param name="ErrorMessage" select="&quot;Attribute 'Mandatory' must appear for 'ItemRef'.&quot;"/>
								<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>

							<xsl:if test="@Mandatory = ''">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;DD0006&quot;"/>
									<xsl:with-param name="Description" select="&quot;Required attributes must be included in Define.xml and cannot be empty.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Presence&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@ItemOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Missing required 'Mandatory' value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>

							<xsl:variable name="mandatoryValue" select="@Mandatory"/>

							<xsl:if test="(($mandatoryValue!='Yes') and ($mandatoryValue!='No'))">
								<xsl:call-template name="ErrorGenaration">
									<xsl:with-param name="Pinnacle-21-RuleID" select="&quot;OD0074&quot;"/>
									<xsl:with-param name="Description" select="&quot;The Mandatory attribute must have a value of 'Yes' or 'No'.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="ItemID" select="@ItemOID"/>
									<xsl:with-param name="ErrorMessage" select="&quot;Invalid Mandatory value.&quot;"/>
									<xsl:with-param name="NodeName" select="&quot;ItemGroupDef/ItemRef&quot;"/>
								</xsl:call-template>
							</xsl:if>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
				<xsl:text> </xsl:text>
			</xsl:for-each>
      
			<xsl:text> </xsl:text>
		</DataValidation>
	</xsl:template>

	<!-- Template to generate Error Report-->
	<xsl:template name="ErrorGenaration">
		<xsl:param name="Pinnacle-21-RuleID"/>
		<xsl:param name="Description"/>
		<xsl:param name="Category"/>
		<xsl:param name="Severity"/>
		<xsl:param name="ItemID"/>
		<xsl:param name="ErrorMessage"/>
		<xsl:param name="NodeName"/>

		<xsl:element name="Validation">



			<xsl:attribute name="Pinnacle-21-RuleID">
				<xsl:value-of select="normalize-space($Pinnacle-21-RuleID)"/>
			</xsl:attribute>

			<xsl:attribute name="Description">
				<xsl:value-of select="normalize-space($Description)"/>
			</xsl:attribute>

			<xsl:attribute name="Category">
				<xsl:value-of select="normalize-space($Category)"/>
			</xsl:attribute>

			<xsl:attribute name="Severity">
				<xsl:value-of select="normalize-space($Severity)"/>
			</xsl:attribute>

			<xsl:attribute name="ItemID">
				<xsl:value-of select="$ItemID"/>
			</xsl:attribute>

			<xsl:attribute name="Error">
				<xsl:value-of select="normalize-space($ErrorMessage)"/>
			</xsl:attribute>

			<xsl:attribute name="NodeName">
				<xsl:value-of select="normalize-space($NodeName)"/>
			</xsl:attribute>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>