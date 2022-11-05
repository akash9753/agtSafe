
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:lang="en" xmlns:def="http://www.cdisc.org/ns/def/v2.0"
                xmlns:odm="http://www.cdisc.org/ns/odm/v1.3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exclude-result-prefixes="nciodm def lang odm xlink xsi html diffgr msdata" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"
                xmlns:nciodm="http://ncicb.nci.nih.gov/xml/odm/EVS/CDISC" xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1">

	<xsl:output method="html" indent="yes"/>

	<xsl:template match="/">

		<xsl:variable name="pathref" select="odm:ODM/@NCIPartPath"/>
		<xsl:variable name="SDTMTerminologyXML" select="document($pathref)"/>

		<nciCodeListValidation>
			<xsl:variable name="terminologyXML" select="$SDTMTerminologyXML/odm:ODM/odm:Study/odm:MetaDataVersion/."/>

			<xsl:for-each select="odm:ODM/odm:Study/odm:MetaDataVersion/odm:CodeList/odm:CodeListItem">
				<xsl:variable name="clOID" select="../@OID"/>
				<xsl:variable name="clName" select="../@Name"/>
				<xsl:variable name="clterm" select="@CodedValue"/>
				<xsl:variable name="OIDAfterDot" select="substring-after($clOID,'.')"/>

				<xsl:variable name="domainandvariable">
					<xsl:for-each select="../../odm:ItemDef/odm:CodeListRef[@CodeListOID=$clOID]">
						<xsl:choose>
							<xsl:when test="position()!=last()">
								<xsl:value-of select="concat(../@OID,',')"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="../@OID"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</xsl:variable>

				<xsl:variable name="variableName">
					<xsl:call-template name="substring-after-last">
						<xsl:with-param name="string" select="$domainandvariable"/>
						<xsl:with-param name="delimiter" select="'.'"/>
					</xsl:call-template>
				</xsl:variable>

				<xsl:variable name="domainvariableaftercomma">
					<xsl:call-template name="substring-after-last">
						<xsl:with-param name="string" select="$domainandvariable"/>
						<xsl:with-param name="delimiter" select="','"/>
					</xsl:call-template>
				</xsl:variable>

				<xsl:variable name="DomainandVariable">
					<xsl:value-of select="substring-after($domainvariableaftercomma,'.')"/>
				</xsl:variable>

				<xsl:variable name="checkterm">
					
					<xsl:for-each select="$terminologyXML/odm:CodeList[@Name=$clName]/odm:EnumeratedItem">

						<xsl:variable name="tclterm" select="@CodedValue"/>
						<xsl:choose>
							<xsl:when test="$clterm=$tclterm">
								<xsl:value-of select="&quot;true &quot;"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:choose>
									<xsl:when test="../@nciodm:CodeListExtensible='No'">
										<xsl:value-of select="&quot;warning&quot;"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="&quot;error&quot;"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
				</xsl:variable>

				<xsl:variable name="decodedValue" select="odm:Decode/odm:TranslatedText"/>
				<xsl:variable name="CLIAliasName" select="odm:Alias/@Name"/>
				<!--	<checkterm>
					<xsl:value-of select="$checkterm"/>
				</checkterm>-->
				<xsl:choose>
					<xsl:when test="not(contains($checkterm,'true'))">

						<xsl:choose>
							<xsl:when test="contains($checkterm,'warning')">
								<xsl:call-template name="NCICodeListValidation">
									<xsl:with-param name="RuleID" select="&quot;CT2001&quot;"/>
									<xsl:with-param name="PublisherID" select="&quot;FDAC340&quot;"/>
									<xsl:with-param name="Message" select="concat(concat($variableName,&quot; value not found in &quot;),concat($clName,' non-extensible codelist'))"/>
									<xsl:with-param name="Description" select="&quot;Variable must be populated with terms from its CDISC controlled terminology codelist. New terms cannot be added into non-extensible codelists.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="DomainVariable" select="$DomainandVariable"/>
									<xsl:with-param name="Term" select="$clterm"/>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:choose>
									<xsl:when test="contains($checkterm,'error')">
										<xsl:call-template name="NCICodeListValidation">
											<xsl:with-param name="RuleID" select="&quot;CT2002&quot;"/>
											<xsl:with-param name="PublisherID" select="&quot;FDAC341&quot;"/>
											<xsl:with-param name="Message" select="concat(concat($variableName,&quot; value not found in &quot;),concat($clName,' extensible codelist'))"/>
											<xsl:with-param name="Description"
											                select="&quot;Variable should be populated with terms from its CDISC controlled terminology codelist. New terms can be added as long as they are not duplicates, synonyms or subsets of existing standard terms.&quot;"/>
											<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
											<xsl:with-param name="Severity" select="&quot;Warning&quot;"/>
											<xsl:with-param name="DomainVariable" select="$DomainandVariable"/>
											<xsl:with-param name="Term" select="$clterm"/>
										</xsl:call-template>
									</xsl:when>
									<xsl:otherwise>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						<xsl:for-each select="$terminologyXML/odm:CodeList[nciodm:CDISCSubmissionValue=$OIDAfterDot and nciodm:CDISCSynonym=$clName]/odm:EnumeratedItem[@CodedValue=$clterm]">
							<xsl:variable name="preferedterm" select="nciodm:PreferredTerm"/>
							<xsl:variable name="extCodeID" select="@nciodm:ExtCodeID"/>
							<xsl:if test="$decodedValue!=$preferedterm">
								<xsl:call-template name="NCICodeListValidation">
									<xsl:with-param name="RuleID" select="&quot;CT2003&quot;"/>
									<xsl:with-param name="PublisherID" select="&quot;FDAC342&quot;"/>
									<xsl:with-param name="Message" select="concat(concat($variableName,&quot; and &quot;),concat($decodedValue ,&quot;values do not have the same Code in DISC CT.&quot;))"/>
									<xsl:with-param name="Description" select="&quot;Paired variables such as TEST/TESTCD must be populated using terms with the same Codelist Code value in CDISC control terminology. There is one-to-one relationship between paired variable values defined in CDISC control terminology by Codelist Code value.&quot;"/>
									<xsl:with-param name="Category" select="&quot;Terminology&quot;"/>
									<xsl:with-param name="Severity" select="&quot;Error&quot;"/>
									<xsl:with-param name="DomainVariable" select="$DomainandVariable"/>
									<xsl:with-param name="Term" select="$clterm"/>
								</xsl:call-template>
							</xsl:if>
							<xsl:if test="$CLIAliasName!=$extCodeID">
                
              
							</xsl:if>
						</xsl:for-each>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</nciCodeListValidation>
	</xsl:template>

	<xsl:template name="substring-after-last">
		<xsl:param name="string"/>
		<xsl:param name="delimiter"/>
		<xsl:choose>
			<xsl:when test="contains($string, $delimiter)">
				<xsl:call-template name="substring-after-last">
					<xsl:with-param name="string" select="substring-after($string, $delimiter)"/>
					<xsl:with-param name="delimiter" select="$delimiter"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$string"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="NCICodeListValidation">
		<xsl:param name="RuleID"/>
		<xsl:param name="PublisherID"/>
		<xsl:param name="Message"/>
		<xsl:param name="Description"/>
		<xsl:param name="Category"/>
		<xsl:param name="Severity"/>
		<xsl:param name="DomainVariable"/>
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
			<xsl:attribute name="DomainVariable">
				<xsl:value-of select="$DomainVariable"/>
			</xsl:attribute>
			<xsl:attribute name="Term">
				<xsl:value-of select="$Term"/>
			</xsl:attribute>
		</xsl:element>
		<xsl:text/>
	</xsl:template>
</xsl:stylesheet>