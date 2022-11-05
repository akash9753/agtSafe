<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:lang="en" xmlns:def="http://www.cdisc.org/ns/def/v2.0"
                xmlns:odm="http://www.cdisc.org/ns/odm/v1.3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="diffgr def lang odm xlink xsi html val msdata" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"
                xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1" xmlns:val="http://www.opencdisc.org/schema/validator">

  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">

    <xsl:variable name="pathref" select="DataSet/@ReferencePath"/>
    <xsl:variable name="DSVLogicXML" select="document($pathref)"/>

    <DSValidation>
      <xsl:variable name="DSVRxml" select="$DSVLogicXML/odm:ODM/odm:Study/odm:MetaDataVersion/."/>
      <xsl:variable name="DSxmlTable" select="DataSet/diffgr:diffgram/NewDataSet/."/>

      <xsl:for-each select="$DSVRxml/odm:ItemGroupDef/val:ValidationRuleRef[@Active='Yes']">

        <xsl:variable name="ruleID" select="@RuleID"/>
        <!--Global checking-->
        <!--Missing datasets-->

        <xsl:if test="../@Name='GLOBAL'">
          <xsl:for-each select="../../val:ValidationRules/*[@ID=$ruleID]">
            <xsl:variable name="term" select="@Terms"/>

            <xsl:variable name="checktable">
              <xsl:for-each select="$DSxmlTable/Table">
                <xsl:variable name="tablename" select="substring-after(TableName,'_')"/>
                <xsl:choose>
                  <xsl:when test="$tablename=$term">
                    <xsl:value-of select="&quot;true &quot;"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="&quot;false &quot;"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:for-each>
            </xsl:variable>

            <xsl:if test="not(contains($checktable,'true'))">
              <xsl:call-template name="DataSetValidation">
                <xsl:with-param name="RuleID" select="@ID"/>
                <xsl:with-param name="PublisherID" select="@PublisherID"/>
                <xsl:with-param name="Message" select="@Message"/>
                <xsl:with-param name="Description" select="@Description"/>
                <xsl:with-param name="Category" select="@Category"/>
                <xsl:with-param name="Severity" select="@Type"/>
                <xsl:with-param name="Variable" select="@Variable"/>
                <xsl:with-param name="Term" select="@Terms"/>
              </xsl:call-template>
            </xsl:if>
          </xsl:for-each>
        </xsl:if>
        <!--Global checking-Missing datasets - ends here-->

        <!--DM: Starts Here-->
        <xsl:if test="../@Name='DM'">
          <xsl:for-each select="../../val:ValidationRules/*[@ID=$ruleID]">

            <xsl:variable name="eltname" select="substring-after(name(),':')"/>
            
            <xsl:variable name="whencondition">
              <xsl:if test="@When">
                <xsl:value-of select="@When"/>
              </xsl:if>
            </xsl:variable>
            
            <xsl:variable name="ifcondition">
              <xsl:if test="@Test">
                <xsl:value-of select="@Test"/>
              </xsl:if>
            </xsl:variable>
            
            <xsl:variable name="id" select="@ID"/>
            <xsl:variable name="publisherID" select="@PublisherID"/>
            <xsl:variable name="message" select="@Message"/>
            <xsl:variable name="description" select="@Description"/>
            <xsl:variable name="category" select="@Category"/>
            <xsl:variable name="severity" select="@Type"/>
            <xsl:variable name="variable" select="@Variable"/>
            <xsl:variable name="term" select="@Terms"/>

            <xsl:for-each select="$DSxmlTable/SDTM_DM">
              <xsl:if test="$eltname='Condition'">
                <xsl:if test="$whencondition!='' and $whencondition">
                  <xsl:if test="$ifcondition!='' and $ifcondition">
                    <xsl:call-template name="DataSetValidation">
                      <xsl:with-param name="RuleID" select="$id"/>
                      <xsl:with-param name="PublisherID" select="$publisherID"/>
                      <xsl:with-param name="USubjectID" select="$publisherID"/>
                      <xsl:with-param name="Message" select="$message"/>
                      <xsl:with-param name="Description" select="$description"/>
                      <xsl:with-param name="Category" select="$category"/>
                      <xsl:with-param name="Severity" select="$severity"/>
                      <xsl:with-param name="Variable" select="$variable"/>
                      <xsl:with-param name="Term" select="$term"/>
                    </xsl:call-template>
                  </xsl:if>
                </xsl:if>
              </xsl:if>
            </xsl:for-each>


            <!--	<xsl:variable name="checktable">
							<xsl:for-each select="$DSxmlTable/Table">
								<xsl:variable name="tablename" select="substring-after(TableName,'_')"/>
								<xsl:choose>
									<xsl:when test="$tablename=$term">
										<xsl:value-of select="&quot;true &quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;false &quot;"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
						</xsl:variable>

						<xsl:if test="not(contains($checktable,'true'))">
							<xsl:call-template name="DataSetValidation">
								<xsl:with-param name="RuleID" select="@ID"/>
								<xsl:with-param name="PublisherID" select="@PublisherID"/>
								<xsl:with-param name="Message" select="@Message"/>
								<xsl:with-param name="Description" select="@Description"/>
								<xsl:with-param name="Category" select="@Category"/>
								<xsl:with-param name="Severity" select="@Type"/>
								<xsl:with-param name="Variable" select="@Variable"/>
								<xsl:with-param name="Term" select="@Terms"/>
							</xsl:call-template>
						</xsl:if>-->
          </xsl:for-each>
        </xsl:if>
        <!--DM: Ends Here-->
      </xsl:for-each>
    </DSValidation>
  </xsl:template>

  <xsl:template name="DataSetValidation">
    <xsl:param name="RuleID"/>
    <xsl:param name="PublisherID"/>
    <xsl:param name="Message"/>
    <xsl:param name="Description"/>
    <xsl:param name="Category"/>
    <xsl:param name="Severity"/>
    <xsl:param name="Variable"/>
    <xsl:param name="Term"/>

    <xsl:element name="nciCLValidation">
      <xsl:attribute name="RuleID">
        <xsl:value-of select="$RuleID"/>
      </xsl:attribute>
      <xsl:attribute name="PublisherID">
        <xsl:value-of select="$PublisherID"/>
      </xsl:attribute>
      <xsl:attribute name="Message">
        <xsl:value-of select="$Message"/>
      </xsl:attribute>
      <xsl:attribute name="Description">
        <xsl:value-of select="$Description"/>
      </xsl:attribute>
      <xsl:attribute name="Severity">
        <xsl:value-of select="$Severity"/>
      </xsl:attribute>
      <xsl:attribute name="Category">
        <xsl:value-of select="$Category"/>
      </xsl:attribute>
      <xsl:attribute name="Variable">
        <xsl:value-of select="$Variable"/>
      </xsl:attribute>
      <xsl:attribute name="Term">
        <xsl:value-of select="$Term"/>
      </xsl:attribute>
    </xsl:element>
    <xsl:text/>
  </xsl:template>
</xsl:stylesheet>