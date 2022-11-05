<!-- 
XSLT to generate Excel(ExportDataAsExcel.xls) file for the DefineXMLWithElementID.xml

  16/11/2018          Vijayalakshmi G         
-->
<xsl:stylesheet version="1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:set="http://exslt.org/sets" xmlns:odm="http://www.cdisc.org/ns/odm/v1.3" xmlns:def="http://www.cdisc.org/ns/def/v2.0" xmlns:y="urn:schemas-microsoft-com:office:spreadsheet">
  <xsl:output method="xml" version="1.0" indent="yes" encoding="UTF-8" media-type="application/vnd.ms-excel" />



  <xsl:template match="/">
    <xsl:processing-instruction name="mso-application">progid="Excel.Sheet"</xsl:processing-instruction>
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="/*">
    <xsl:variable name="defStandardNameforAdamCheck" select="odm:Study/odm:MetaDataVersion/@def:StandardName"/>
    <Workbook StudyID="{@StudyID}" xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:x2="http://schemas.microsoft.com/office/excel/2003/xml"
		          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:msxsl="urn:schemas-microsoft-com:xslt" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:html="http://www.w3.org/TR/REC-html40"
		          xmlns:c="urn:schemas-microsoft-com:office:component:spreadsheet">
      <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office"/>
      <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel" />

      <Styles>
        <Style ss:ID="LockedHeader" ss:Name="Locked">
          <Alignment ss:WrapText="0"/>
          <Font ss:FontName="Verdana" ss:Bold="1" ss:Italic="1" ss:Color="red"/>
          <Protection ss:Protected="1"/>
        </Style>
        <Style ss:ID="UnLockedHeader" ss:Name="Normal">
          <Alignment ss:WrapText="0"/>
          <Font ss:FontName="Verdana" ss:Bold="1" ss:Italic="1" ss:Color="green"/>
        </Style>

        <Style ss:ID="UnLockedData" ss:Name="NonProtectable">
          <Alignment ss:WrapText="1"/>
          <Font ss:Color="black"/>
          <Protection ss:Protected="0"/>
        </Style>

        <Style ss:ID="LockedData" ss:Name="Protectable">
          <Alignment ss:WrapText="1"/>
          <Font ss:Color="red"/>
        </Style>
        <Style ss:ID="TableSettings" ss:Name="Tables">
          <column ss:AutoFitWidth="1" ss:Width="100"/>
        </Style>
      </Styles>

      <Worksheet ss:Name="{'Study'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C9" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">

          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="150"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Backround details-->
          <Column ss:Index="7" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="8" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="9" ss:Hidden="1" ss:AutoFitWidth="0"/>

          <Row>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'StudyName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'StudyDescription'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'SponsorName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'ProtocolName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'StandardName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'StandardVersionName'"/>
              </Data>
            </Cell>
          </Row>

          <Row>
            <Cell ss:StyleID="LockedData" stylename="Protectable" title="mandatory">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:GlobalVariables/odm:StudyName"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Study/odm:GlobalVariables/odm:StudyDescription/@ElementID}" ename="StudyDescription" nodename="GlobalVariables" xpath="{odm:Study/@Xpath}" tableid="{odm:Study/@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:GlobalVariables/odm:StudyDescription"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Originator" nodename="ODM" xpath="{@Xpath}" tableid="{@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="@Originator"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Study/odm:GlobalVariables/odm:ProtocolName/@ElementID}" ename="ProtocolName" nodename="GlobalVariables" xpath="{odm:Study/@Xpath}" tableid="{odm:Study/@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:GlobalVariables/odm:ProtocolName"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedData" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:MetaDataVersion/@def:StandardName"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedData" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:MetaDataVersion/@def:StandardVersion"/>
              </Data>
            </Cell>

            <!--Backround Details-->
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Study/odm:GlobalVariables/odm:StudyDescription/@ElementID}" ename="StudyDescription_BGCopy" nodename="GlobalVariables" xpath="{odm:Study/@Xpath}" tableid="{odm:Study/@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:GlobalVariables/odm:StudyDescription"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Originator_BGCopy" nodename="ODM" xpath="{@Xpath}" tableid="{@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="@Originator"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Study/odm:GlobalVariables/odm:ProtocolName/@ElementID}" ename="ProtocolName_BGCopy" nodename="GlobalVariables" xpath="{odm:Study/@Xpath}" tableid="{odm:Study/@TableID}">
              <Data ss:Type="String">
                <xsl:value-of select="odm:Study/odm:GlobalVariables/odm:ProtocolName"/>
              </Data>
            </Cell>
          </Row>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>True</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
      </Worksheet>

      <!--Domain MetaData-->
      <Worksheet ss:Name="{'StudyDomainMetaData'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C18" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Bacround Details-->
          <Column ss:Index="12" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="13" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="14" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="15" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="16" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="17" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="18" ss:Hidden="1" ss:AutoFitWidth="0"/>

          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Domain'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Label'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DomainClass'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Purpose'"/>
              </Data>
            </Cell>

            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Repeating'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'ReferenceData'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Structure'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'KeyVariable'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'AliasContext'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'AliasName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Comment'"/>
              </Data>
            </Cell>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemGroupDef">
            <xsl:variable name="KeyVariables">
              <xsl:for-each select="odm:ItemRef">
                <xsl:if test="@KeySequence!=''">
                  <xsl:variable name="ItemOIDkeys" select="substring-after(substring-after(@ItemOID, '.'),'.')"/>
                  <xsl:if test="$ItemOIDkeys != ''">
                    <xsl:value-of select="concat($ItemOIDkeys,',')"/>
                  </xsl:if>
                </xsl:if>
              </xsl:for-each>
            </xsl:variable>
            <xsl:variable name="defCommentDefOID" select="@def:CommentOID"/>
            <xsl:variable name="commentdef">
              <xsl:for-each select="../def:CommentDef[@OID = $defCommentDefOID]">
                <xsl:value-of select="odm:Description/odm:TranslatedText"/>
              </xsl:for-each>
            </xsl:variable>

            <Row>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="@Domain"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="@def:Class"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="@Purpose"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Repeating" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Repeating"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="IsReferenceData" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@IsReferenceData"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="def:Structure" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@def:Structure"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="KeyVariable" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="substring($KeyVariables,1,string-length($KeyVariables)-1)"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Alias/@ElementID}" ename="Context" nodename="Alias" xpath="{odm:Alias/@Xpath}" tableid="{odm:Alias/@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Alias/@Context"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Alias/@ElementID}" ename="Name" nodename="Alias" xpath="{odm:Alias/@Xpath}" tableid="{odm:Alias/@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Alias/@Name"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$commentdef"/>
                </Data>
              </Cell>
              <!--Backround Details-->
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Repeating_BGCopy" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Repeating"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="IsReferenceData_BGCopy" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@IsReferenceData"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="def:Structure_BGCopy" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@def:Structure"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="KeyVariable_BGCopy" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="substring($KeyVariables,1,string-length($KeyVariables)-1)"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Alias/@ElementID}" ename="Context_BGCopy" nodename="Alias" xpath="{odm:Alias/@Xpath}" tableid="{odm:Alias/@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Alias/@Context"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Alias/@ElementID}" ename="Name_BGCopy" nodename="Alias" xpath="{odm:Alias/@Xpath}" tableid="{odm:Alias/@TableID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Alias/@Name"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment_BGCopy" nodename="ItemGroupDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$commentdef"/>
                </Data>
              </Cell>
            </Row>
          </xsl:for-each>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemGroupDef/odm:ItemRef">
            <xsl:if test="@KeySequence">
              <Row>
                <Cell ss:Index="15" ss:StyleID="LockedData" id="{@ElementID}" nodename="ItemRef" ename="KeySequence" xpath="{@Xpath}" tableid="{@TableID}">
                  <Data ss:Type="String">
                    <xsl:value-of select="@KeySequence"/>
                  </Data>
                </Cell>
              </Row>
            </xsl:if>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>5</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
          <ProtectStructure>True</ProtectStructure>
        </WorksheetOptions>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C5</Range>
          <Type>List</Type>
          <!--YesNo-->
          <Value>=INDIRECT("DDLValues!$A$2:$A$3")</Value>
        </DataValidation>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C6</Range>
          <Type>List</Type>
          <!--YesNo-->
          <Value>=INDIRECT("DDLValues!$A$2:$A$3")</Value>
        </DataValidation>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C9</Range>
          <Type>List</Type>
          <!--AliasContext-->
          <Value>=INDIRECT("DDLValues!$G$2:$G$3")</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C11</Range>
          <Type>List</Type>
          <!--Comment-->
          <Value>=OFFSET(INDIRECT("StudyComment!$A$2"),0,0,COUNTA(INDIRECT("StudyComment!$A:$A"))-1,1)</Value>
        </DataValidation>
      </Worksheet>

      <!--Variable Level MetaData-->

      <Worksheet ss:Name="{'StudyVariableLevelMetaData'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C31" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <!--Comment:16-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--CodeListType:17-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--CodeList:18-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Method:19-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <xsl:choose>
            <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
              <Column ss:AutoFitWidth="1" ss:Width="100"/>
              <!--Destination:20-->
              <!--Backround Details-->

              <Column ss:Index="22" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="23" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="24" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="25" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="26" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="27" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="28" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="29" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="30" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="31" ss:Hidden="1" ss:AutoFitWidth="0"/>
            </xsl:when>
            <xsl:otherwise>
              <!--Destination:20-->
              <!--Backround Details-->
              <Column ss:Index="21" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="22" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="23" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="24" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="25" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="26" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="27" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="28" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="29" ss:Hidden="1" ss:AutoFitWidth="0"/>
            </xsl:otherwise>
          </xsl:choose>

          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Domain'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'VariableName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'VariableLabel'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'OrderNumber'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DataType'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'VariableLength'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'SignificantDigits'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DisplayFormat'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'ValueLevelID'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Role'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Mandatory'"/>
              </Data>
            </Cell>

            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Origin'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Pages'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'FirstPage'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'LastPage'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Comment'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListType'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListID'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Method'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Destination'"/>
              </Data>
            </Cell>
            <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
              <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
                <Data ss:Type="String">
                  <xsl:value-of select="'OriginLabel'"/>
                </Data>
              </Cell>
            </xsl:if>
          </Row>


          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemGroupDef/odm:ItemRef">

            <xsl:variable name="orderNumber" select="@OrderNumber"/>
            <xsl:variable name="mandatory" select="@Mandatory"/>
            <xsl:variable name="methodOID" select="@MethodOID"/>
            <xsl:variable name="IGDIREID" select="@ElementID"/>
            <xsl:variable name="IGDIRTID" select="@TableID"/>
            <xsl:variable name="IGDIRXpath" select="@Xpath"/>

            <xsl:variable name="role">
              <xsl:choose>
                <xsl:when test="@Role">
                  <xsl:value-of select="@Role"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="''"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:variable>
            <xsl:variable name="itemRefItemOID" select="@ItemOID"/>
            <xsl:for-each select="../../odm:ItemDef">
              <xsl:if test="$itemRefItemOID=@OID">
                <xsl:variable name="defCommentDefOID" select="@def:CommentOID"/>

                <xsl:variable name="domain" select="substring-before(substring-after(@OID, '.'),'.')"/>
                <xsl:variable name="variableName" select="substring-after(substring-after(@OID, '.'),'.')"/>
                <xsl:variable name="destination">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@Type">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@Type"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="originPages">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@PageRefs">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@PageRefs"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="firstPage">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@FirstPage">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@FirstPage"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="lastPage">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@LastPage">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@LastPage"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="codeListOID">
                  <xsl:if test="odm:CodeListRef/@CodeListOID">
                    <xsl:value-of select="odm:CodeListRef/@CodeListOID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codelisttype">
                  <xsl:for-each select="../odm:CodeList">
                    <xsl:if test="$codeListOID=@OID">
                      <xsl:choose>
                        <xsl:when test="@CodelistType='ExternalCodeList'">
                          <xsl:value-of select="'Dictionary'"/>                    
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="'Codelist'"/>                   
                        </xsl:otherwise>              
                      </xsl:choose>                              
                    </xsl:if>
                  </xsl:for-each>
                </xsl:variable>

                <xsl:variable name="testfordoubledot" select="substring-after($codeListOID,'.')"/>
                <xsl:variable name="codeListID">
                  <xsl:choose>
                    <xsl:when test="contains($testfordoubledot,'.')">
                      <xsl:value-of select="substring-after($testfordoubledot,'.')"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="$testfordoubledot"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>

                <xsl:variable name="valueLevelID">
                  <xsl:if test="def:ValueListRef/@ValueListOID">
                    <xsl:value-of select="def:ValueListRef/@ValueListOID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="significantDigits">
                  <xsl:if test="@SignificantDigits">
                    <xsl:value-of select="@SignificantDigits"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="displayFormat">
                  <xsl:if test="@def:DisplayFormat">
                    <xsl:value-of select="@def:DisplayFormat"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="commentdef">
                  <xsl:for-each select="../def:CommentDef[@OID = $defCommentDefOID]">
                    <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                  </xsl:for-each>
                </xsl:variable>

                <xsl:variable name="methoddef">
                  <xsl:for-each select="../odm:MethodDef[@OID = $methodOID]">
                    <xsl:value-of select="@Name"/>
                  </xsl:for-each>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefEID">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@ElementID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefEID">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@ElementID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefTableID">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@TableID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefTableID">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@TableID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefXpath">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefXpath">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defOriginDescriptionTT">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defOriginDescriptionTTEID">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@ElementID"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="defOriginDescriptionTTTableID">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@TableID"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="defOriginDescriptionTTXPath">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <Row>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$domain"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$variableName"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$orderNumber"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="@DataType"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="@Length"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$significantDigits"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$displayFormat"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$valueLevelID"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$role"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$mandatory"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{def:Origin/@ElementID}" ename="OriginType" nodename="def:Origin" xpath="{def:Origin/@Xpath}" tableid="{def:Origin/@TableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="def:Origin/@Type"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$originPages"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$firstPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage" nodename="def:PDFPageRef" ss:Formula="" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$lastPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment" nodename="ItemDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$commentdef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" >
                    <Data ss:Type="String">
                      <xsl:value-of select="$codelisttype"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$codeListRefEID}" ename="CodeListOID" nodename="CodeListRef" xpath="{$codeListRefXpath}" tableid="{$codeListRefTableID}" codelistoid="{$codeListID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$codeListID"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$IGDIREID}" ename="Method" tableid="{$IGDIRTID}" nodename="ItemRef" xpath="{$IGDIRXpath}" methodoid="{$methodOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$methoddef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$destination"/>
                    </Data>
                  </Cell>

                  <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defOriginDescriptionTTEID}" ename="OriginDescription" nodename="TransalatedText" xpath="{$defOriginDescriptionTTXPath}" tableid="{$defOriginDescriptionTTTableID}">
                      <Data ss:Type="String">
                        <xsl:value-of select="$defOriginDescriptionTT"/>
                      </Data>
                    </Cell>
                  </xsl:if>

                  <!--Backround Details-->
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{def:Origin/@ElementID}" ename="OriginType_BGCopy" nodename="def:Origin" xpath="{def:Origin/@Xpath}" tableid="{def:Origin/@TableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="def:Origin/@Type"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$originPages"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$firstPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage_BGCopy" nodename="def:PDFPageRef" ss:Formula="" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$lastPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment_BGCopy" nodename="ItemDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$commentdef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="''"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$codeListRefEID}" ename="CodeListOID_BGCopy" nodename="CodeListRef" xpath="{$codeListRefXpath}" tableid="{$codeListRefTableID}" codelistoid="{$codeListID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$codeListID"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$IGDIREID}" ename="Method_BGCopy" tableid="{$IGDIRTID}" nodename="ItemRef" xpath="{$IGDIRXpath}" methodoid="{$methodOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$methoddef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$destination"/>
                    </Data>
                  </Cell>
                  <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defOriginDescriptionTTEID}" ename="OriginDescription_BGCopy" nodename="TransalatedText" xpath="{$defOriginDescriptionTTXPath}" tableid="{$defOriginDescriptionTTTableID}">
                      <Data ss:Type="String">
                        <xsl:value-of select="$defOriginDescriptionTT"/>
                      </Data>
                    </Cell>
                  </xsl:if>
                </Row>
              </xsl:if>
            </xsl:for-each>
          </xsl:for-each>
        </Table>

        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>11</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <xsl:choose>
          <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
            <AutoFilter x:Range="R1C1:R200C20" xmlns="urn:schemas-microsoft-com:office:excel">
            </AutoFilter>
          </xsl:when>
          <xsl:otherwise>
            <AutoFilter x:Range="R1C1:R200C19" xmlns="urn:schemas-microsoft-com:office:excel">
            </AutoFilter>
          </xsl:otherwise>
        </xsl:choose>

        <xsl:choose>
          <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
            <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
              <Range>C12</Range>
              <Type>List</Type>
              <!--Origin-->
              <Value>=INDIRECT("DDLValues!$B$3:$B$7")</Value>
            </DataValidation>
          </xsl:when>
          <xsl:otherwise>
            <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
              <Range>C12</Range>
              <Type>List</Type>
              <!--Origin-->
              <Value>=INDIRECT("DDLValues!$B$2:$B$6")</Value>
            </DataValidation>
          </xsl:otherwise>
        </xsl:choose>



        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C16</Range>
          <Type>List</Type>
          <!--Comment-->
          <Value>=OFFSET(INDIRECT("StudyComment!$A$2"),0,0,COUNTA(INDIRECT("StudyComment!$A:$A"))-1,1)</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C17</Range>
          <Type>List</Type>
          <!--CodeListType-->
          <Value>&quot;Codelist,Dictionary&quot;</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C18</Range>
          <Type>List</Type>
          <!--CodeList and Dictionary-->

          <!--<Value>IF(RC17=&quot;CodeList&quot;,OFFSET(INDIRECT(&quot;CodeList!$Q$4&quot;),0,0,ROWS(INDIRECT(&quot;CodeList!$Q:$Q&quot;))-COUNTBLANK(INDIRECT(&quot;CodeList!$Q:$Q&quot;)),1),OFFSET(INDIRECT(&quot;StudyDictionary!$A$2&quot;),0,0,COUNTA(INDIRECT(&quot;StudyDictionary!$A:$A&quot;)),1))</Value>-->

          <Value>IF(RC17=&quot;CodeList&quot;,OFFSET(INDIRECT(&quot;CodeList!$Q$4&quot;),0,0,ROWS(INDIRECT(&quot;CodeList!$Q:$Q&quot;))-COUNTBLANK(INDIRECT(&quot;CodeList!$Q:$Q&quot;)),1),OFFSET(INDIRECT(&quot;StudyDictionary!$A$2&quot;),0,0,COUNTA(INDIRECT(&quot;StudyDictionary!$A:$A&quot;))-1,1))</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C19</Range>
          <Type>List</Type>
          <!--Method-->
          <Value>=OFFSET(INDIRECT("StudyMethod!$A$2"),0,0,COUNTA(INDIRECT("StudyMethod!$A:$A"))-1,1)</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C20</Range>
          <Type>List</Type>
          <!--Destination-->
          <Value>=INDIRECT("DDLValues!$C$2:$C$3")</Value>
        </DataValidation>
      </Worksheet>

      <!--Value Level MetaData-->

      <Worksheet ss:Name="{'StudyValueLevelMetaData'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C29" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Comment:14-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Codelisttype:15-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--CodeList:16-->
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <!--Method:17-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Mandatory:18-->
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Destination:19-->
          <xsl:choose>
            <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
              <Column ss:AutoFitWidth="1" ss:Width="100"/>
              <!--Backround Details-->

              <Column ss:Index="21" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="22" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="23" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="24" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="25" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="26" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="27" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="28" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="29" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="30" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="31" ss:Hidden="1" ss:AutoFitWidth="0"/>

            </xsl:when>
            <xsl:otherwise>

              <!--Backround Details-->
              <Column ss:Index="20" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="21" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="22" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="23" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="24" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="25" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="26" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="27" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="28" ss:Hidden="1" ss:AutoFitWidth="0"/>
              <Column ss:Index="29" ss:Hidden="1" ss:AutoFitWidth="0"/>
            </xsl:otherwise>
          </xsl:choose>


          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Domain'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'VariableName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'SASFieldName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'ValueName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Label'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DataType'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Length'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'SignificantDigits'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DisplayFormat'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Origin'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Pages'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'FirstPage'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'LastPage'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Comment'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListType'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListID'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Method'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Mandatory'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Destination'"/>
              </Data>
            </Cell>
            <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
              <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
                <Data ss:Type="String">
                  <xsl:value-of select="'OriginLabel'"/>
                </Data>
              </Cell>
            </xsl:if>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/def:ValueListDef/odm:ItemRef">
            <xsl:variable name="isMandatory" select="@Mandatory"/>
            <xsl:variable name="irEID" select="@ElementID"/>
            <xsl:variable name="irTableID" select="@TableID"/>
            <xsl:variable name="irXpath" select="@Xpath"/>
            <xsl:variable name="itemRefItemOID" select="@ItemOID"/>
            <xsl:variable name="methodOID" select="@MethodOID"/>

            <xsl:for-each select="../../odm:ItemDef">
              <xsl:if test="$itemRefItemOID=@OID">
                <xsl:variable name="defCommentDefOID" select="@def:CommentOID"/>

                <xsl:variable name="domain" select="substring-before(substring-after(@OID, '.'),'.')"/>
                <xsl:variable name="variableName" select="substring-before(substring-after(substring-after(@OID, '.'),'.'),'.')"/>
                <xsl:variable name="destination">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@Type">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@Type"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="originPages">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@PageRefs">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@PageRefs"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="firstPage">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@FirstPage">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@FirstPage"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="lastPage">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef/@LastPage">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@LastPage"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListOID">
                  <xsl:if test="odm:CodeListRef/@CodeListOID">
                    <xsl:value-of select="odm:CodeListRef/@CodeListOID"/>
                  </xsl:if>
                </xsl:variable>
                
                <xsl:variable name="codelisttype">
                  <xsl:for-each select="../odm:CodeList">
                    <xsl:if test="$codeListOID=@OID">
                      <xsl:choose>
                        <xsl:when test="@CodelistType='ExternalCodeList'">
                          <xsl:value-of select="'Dictionary'"/>                    
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="'Codelist'"/>                   
                        </xsl:otherwise>              
                      </xsl:choose>                              
                    </xsl:if>
                  </xsl:for-each>
                </xsl:variable>


                <xsl:variable name="testfordoubledot" select="substring-after($codeListOID,'.')"/>
                <xsl:variable name="codeListID">
                  <xsl:choose>
                    <xsl:when test="contains($testfordoubledot,'.')">
                      <xsl:value-of select="substring-after($testfordoubledot,'.')"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="$testfordoubledot"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:variable>

                <xsl:variable name="significantDigits">

                  <xsl:if test="@SignificantDigits">
                    <xsl:value-of select="@SignificantDigits"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="displayFormat">

                  <xsl:if test="@def:DisplayFormat">
                    <xsl:value-of select="@def:DisplayFormat"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="commentdef">
                  <xsl:for-each select="../def:CommentDef[@OID = $defCommentDefOID]">
                    <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                  </xsl:for-each>
                </xsl:variable>


                <xsl:variable name="methoddef">
                  <xsl:for-each select="../odm:MethodDef[@OID = $methodOID]">
                    <xsl:value-of select="@Name"/>
                  </xsl:for-each>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefEID">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@ElementID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefEID">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@ElementID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefTableID">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@TableID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefTableID">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@TableID"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defPDFPageRefXpath">
                  <xsl:if test="def:Origin/def:DocumentRef/def:PDFPageRef">
                    <xsl:value-of select="def:Origin/def:DocumentRef/def:PDFPageRef/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="codeListRefXpath">
                  <xsl:if test="odm:CodeListRef">
                    <xsl:value-of select="odm:CodeListRef/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defOriginDescriptionTT">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText"/>
                  </xsl:if>
                </xsl:variable>

                <xsl:variable name="defOriginDescriptionTTEID">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@ElementID"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="defOriginDescriptionTTTableID">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@TableID"/>
                  </xsl:if>
                </xsl:variable>
                <xsl:variable name="defOriginDescriptionTTXPath">
                  <xsl:if test="def:Origin/odm:Description/odm:TranslatedText">
                    <xsl:value-of select="def:Origin/odm:Description/odm:TranslatedText/@Xpath"/>
                  </xsl:if>
                </xsl:variable>

                <Row>

                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$domain"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$variableName"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="@SASFieldName"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="substring-before(substring-after(@Name,'.'),'.')"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="@DataType"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="@Length"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$significantDigits"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="LockedData" stylename="Protectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$displayFormat"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{def:Origin/@ElementID}" ename="OriginType" nodename="def:Origin" xpath="{def:Origin/@Xpath}" tableid="{def:Origin/@TableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="def:Origin/@Type"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$originPages"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$firstPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$lastPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment" nodename="ItemDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$commentdef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="''"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$codeListRefEID}" ename="CodeListOID" nodename="CodeListRef" xpath="{$codeListRefXpath}" tableid="{$codeListRefTableID}" codelistoid="{$codeListID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$codeListID"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$irEID}" ename="Method" nodename="ItemRef" tableid="{$irTableID}" xpath="{$irXpath}" methodoid="{$methodOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$methoddef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$irEID}" ename="Mandatory" nodename="ItemRef" tableid="{$irTableID}" xpath="{$irXpath}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$isMandatory"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$destination"/>
                    </Data>
                  </Cell>
                  <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defOriginDescriptionTTEID}" ename="OriginDescription" nodename="TransalatedText" xpath="{$defOriginDescriptionTTXPath}" tableid="{$defOriginDescriptionTTTableID}">
                      <Data ss:Type="String">
                        <xsl:value-of select="$defOriginDescriptionTT"/>
                      </Data>
                    </Cell>
                  </xsl:if>

                  <!--Backround Details-->
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{def:Origin/@ElementID}" ename="OriginType_BGCopy" nodename="def:Origin" xpath="{def:Origin/@Xpath}" tableid="{def:Origin/@TableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="def:Origin/@Type"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$originPages"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$firstPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$lastPage"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Comment_BGCopy" nodename="ItemDef" xpath="{@Xpath}" tableid="{@TableID}" commentoid="{$defCommentDefOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$commentdef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable">
                    <Data ss:Type="String">
                      <xsl:value-of select="$codelisttype"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$codeListRefEID}" ename="CodeListOID_BGCopy" nodename="CodeListRef" xpath="{$codeListRefXpath}" tableid="{$codeListRefTableID}" codelistoid="{$codeListID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$codeListID"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$irEID}" ename="Method_BGCopy" nodename="ItemRef" tableid="{$irTableID}" xpath="{$irXpath}" methodoid="{$methodOID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$methoddef"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$irEID}" ename="Mandatory_BGCopy" nodename="ItemRef" tableid="{$irTableID}" xpath="{$irXpath}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$isMandatory"/>
                    </Data>
                  </Cell>
                  <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" xpath="{$defPDFPageRefXpath}" tableid="{$defPDFPageRefTableID}">
                    <Data ss:Type="String">
                      <xsl:value-of select="$destination"/>
                    </Data>
                  </Cell>
                  <xsl:if test ="$defStandardNameforAdamCheck='ADAM'">
                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defOriginDescriptionTTEID}" ename="OriginDescription_BGCopy" nodename="TransalatedText" xpath="{$defOriginDescriptionTTXPath}" tableid="{$defOriginDescriptionTTTableID}">
                      <Data ss:Type="String">
                        <xsl:value-of select="$defOriginDescriptionTT"/>
                      </Data>
                    </Cell>
                  </xsl:if>
                </Row>
              </xsl:if>
            </xsl:for-each>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>9</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <xsl:choose>
          <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
            <AutoFilter x:Range="R1C1:R180C19" xmlns="urn:schemas-microsoft-com:office:excel">
            </AutoFilter>
          </xsl:when>
          <xsl:otherwise>
            <AutoFilter x:Range="R1C1:R180C18" xmlns="urn:schemas-microsoft-com:office:excel">
            </AutoFilter>

          </xsl:otherwise>
        </xsl:choose>

        <xsl:choose>
          <xsl:when test ="$defStandardNameforAdamCheck='ADAM'">
            <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
              <Range>C10</Range>
              <Type>List</Type>
              <!--Origin-->
              <Value>=INDIRECT("DDLValues!$B$3:$B$7")</Value>
            </DataValidation>
          </xsl:when>
          <xsl:otherwise>
            <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
              <Range>C10</Range>
              <Type>List</Type>
              <!--Origin-->
              <Value>=INDIRECT("DDLValues!$B$2:$B$6")</Value>
            </DataValidation>
          </xsl:otherwise>
        </xsl:choose>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C14</Range>
          <Type>List</Type>
          <Value>=OFFSET(INDIRECT("StudyComment!$A$2"),0,0,COUNTA(INDIRECT("StudyComment!$A:$A"))-1,1)</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C15</Range>
          <Type>List</Type>
          <!--CodeListType-->
          <Value>&quot;Codelist,Dictionary&quot;</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C16</Range>
          <Type>List</Type>
          <!--CodeList and Dictionary-->
          <Value>IF(RC15=&quot;CodeList&quot;,OFFSET(INDIRECT(&quot;CodeList!$Q$4&quot;),0,0,ROWS(INDIRECT(&quot;CodeList!$Q:$Q&quot;))-COUNTBLANK(INDIRECT(&quot;CodeList!$Q:$Q&quot;)),1),OFFSET(INDIRECT(&quot;StudyDictionary!$A$2&quot;),0,0,COUNTA(INDIRECT(&quot;StudyDictionary!$A:$A&quot;))-1,1))</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C17</Range>
          <Type>List</Type>
          <!--Method-->
          <Value>=OFFSET(INDIRECT("StudyMethod!$A$2"),0,0,COUNTA(INDIRECT("StudyMethod!$A:$A"))-1,1)</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C18</Range>
          <Type>List</Type>
          <!--YesNo-->
          <Value>=INDIRECT("DDLValues!$A$2:$A$3")</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C19</Range>
          <Type>List</Type>
          <!--Destination-->
          <Value>=INDIRECT("DDLValues!$C$2:$C$3")</Value>
        </DataValidation>
      </Worksheet>

      <!--CodeList-->

      <Worksheet ss:Name="{'CodeList'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C20" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!-- Backround Details-->
          <Column ss:Index="12" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="13" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="14" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="15" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="16" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="17" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="18" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="19" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="20" ss:Hidden="1" ss:AutoFitWidth="0"/>

          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'FullName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DataType'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'NCICodelistCode'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Term'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'NCITermCode'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DecodedValue'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'IsExtensible'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'OrderNumber'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Rank'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'SasFormatName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'UniqueCodeList'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'dummycolumn'"/>
              </Data>
            </Cell>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:CodeList/*">
            <xsl:variable name="nciCodelistCode">
              <xsl:if test="../odm:Alias">
                <xsl:value-of select="../odm:Alias/@Name"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="aliasEID">
              <xsl:if test="../odm:Alias">
                <xsl:value-of select="../odm:Alias/@ElementID"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="aliasTableID">
              <xsl:if test="../odm:Alias">
                <xsl:value-of select="../odm:Alias/@TableID"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="aliasXpath">
              <xsl:if test="../odm:Alias">
                <xsl:value-of select="../odm:Alias/@Xpath"/>
              </xsl:if>
            </xsl:variable>

            <xsl:if test="local-name() != 'ExternalCodeList' and local-name() != 'Alias'">

              <xsl:variable name="CLEID">
                <xsl:value-of select="../@ElementID"/>
              </xsl:variable>

              <xsl:variable name="CLTID">
                <xsl:value-of select="../@TableID"/>
              </xsl:variable>

              <xsl:variable name="CLXpath">
                <xsl:value-of select="../@Xpath"/>
              </xsl:variable>

              <xsl:variable name="codelistOID" select="../@OID"/>
              <xsl:variable name="testfordoubledot" select="substring-after(../@OID,'.')"/>
              <xsl:variable name="codeListName">
                <xsl:choose>
                  <xsl:when test="contains($testfordoubledot,'.')">
                    <xsl:value-of select="substring-after($testfordoubledot,'.')"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="$testfordoubledot"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="term">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@CodedValue"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@CodedValue"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="nciTermCode">
                <xsl:if test="odm:Alias">
                  <xsl:value-of select="odm:Alias/@Name"/>
                </xsl:if>
              </xsl:variable>
              <xsl:variable name="decodedValue">
                <xsl:if test="odm:Decode">
                  <xsl:value-of select="odm:Decode/odm:TranslatedText"/>
                </xsl:if>
              </xsl:variable>

              <xsl:variable name="isExtensible">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@def:ExtendedValue"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@def:ExtendedValue"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="orderNumber">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@OrderNumber"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@OrderNumber"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="rank">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@Rank"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@Rank"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="cliOreiEID">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@ElementID"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@ElementID"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="decodeEID">
                <xsl:choose>
                  <xsl:when test="odm:Decode">
                    <xsl:value-of select="odm:Decode/odm:TranslatedText/@ElementID"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="../@ElementID"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <xsl:variable name="cliOreiAliasEID">
                <xsl:if test="odm:Alias">
                  <xsl:value-of select="odm:Alias/@ElementID"/>
                </xsl:if>
              </xsl:variable>


              <xsl:variable name="cliOreiTableID">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@TableID"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@TableID"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="decodeTableID">
                <xsl:choose>
                  <xsl:when test="odm:Decode">
                    <xsl:value-of select="odm:Decode/odm:TranslatedText/@TableID"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="../@TableID"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="cliOreiAliasTableID">
                <xsl:if test="odm:Alias">
                  <xsl:value-of select="odm:Alias/@TableID"/>
                </xsl:if>
              </xsl:variable>


              <xsl:variable name="cliOreiXpath">
                <xsl:choose>
                  <xsl:when test="local-name()='CodeListItem'">
                    <xsl:value-of select="@Xpath"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test="local-name()='EnumeratedItem'">
                      <xsl:value-of select="@Xpath"/>
                    </xsl:if>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="decodeXpath">
                <xsl:choose>
                  <xsl:when test="odm:Decode">
                    <xsl:value-of select="odm:Decode/odm:TranslatedText/@Xpath"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="concat($cliOreiXpath,'/Decode/TranslatedText')"/>
                  </xsl:otherwise>
                </xsl:choose>

              </xsl:variable>
              <xsl:variable name="cliOreiAliasXpath">
                <xsl:if test="odm:Alias">
                  <xsl:value-of select="odm:Alias/@Xpath"/>
                </xsl:if>
              </xsl:variable>

              <Row>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$CLEID}" ename="OID" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}" ChangedCodeListOID="{$codeListName}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$codeListName"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$CLEID}" ename="Name" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@Name"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$CLEID}" ename="DataType" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@DataType"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$aliasEID}" ename="Name" nodename="Alias" tableid="{$aliasTableID}" xpath="{$aliasXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$nciCodelistCode"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="CodedValue" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$term"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$cliOreiAliasEID}" ename="Name" nodename="Alias" tableid="{$cliOreiAliasTableID}" xpath="{$cliOreiAliasXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$nciTermCode"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$decodeEID}" ename="TranslatedText" nodename="Decode" tableid="{$decodeTableID}" xpath="{$decodeXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$decodedValue"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="def:ExtendedValue" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$isExtensible"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="OrderNumber" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$orderNumber"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="Rank" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$rank"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$CLEID}" ename="SASFormatName" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@SASFormatName"/>
                  </Data>
                </Cell>

                <!-- Backround Details-->
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="CodedValue_BGCopy" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$term"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$decodeEID}" ename="TranslatedText_BGCopy" nodename="Decode" tableid="{$decodeTableID}" xpath="{$decodeXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$decodedValue"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="def:ExtendedValue_BGCopy" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$isExtensible"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="OrderNumber_BGCopy" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$orderNumber"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$cliOreiEID}" ename="Rank_BGCopy" nodename="{local-name()}" tableid="{$cliOreiTableID}" xpath="{$cliOreiXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$rank"/>
                  </Data>
                </Cell>
                <!--Getting Unique CodeList: first two cells are empty and from third the Unique CodeList starts-->
                <xsl:choose>
                  <xsl:when test="position()=1 or position()=2">
                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" ss:Formula="">
                      <Data ss:Type="String">
                        <xsl:value-of select="''"/>
                      </Data>
                    </Cell>
                  </xsl:when>
                  <xsl:otherwise>

                    <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" ss:Formula="=IF(IFERROR(INDEX(R2C1:R1000C1,MATCH(0, INDEX(COUNTIF(R2C17:R[-1]C,R2C1:R1000C1),0, 0), 0)),&quot;&quot;)=0,&quot;&quot;,IFERROR(INDEX(R2C1:R1000C1,MATCH(0, INDEX(COUNTIF(R2C17:R[-1]C,R2C1:R1000C1),0, 0), 0)),&quot;&quot;))">
                      <Data ss:Type="String">
                      </Data>
                    </Cell>
                  </xsl:otherwise>
                </xsl:choose>
                <!--Merging two columns: CodeList and Dictionary(for future use)-->
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" ss:Formula="=IF(ROW()&gt;COUNTA(C17)+COUNTA(INDIRECT(&quot;StudyDictionary!$A:$A&quot;)),&quot;&quot;,IF(ROW()&gt;COUNTA(C17)+1,OFFSET(INDIRECT(&quot;StudyDictionary!$A$2&quot;),ROW()-2-COUNTA(C17),0,1,1),OFFSET(C17,ROW()-1,0,1,1)))">
                </Cell>
              </Row>
            </xsl:if>
          </xsl:for-each>


          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:CodeList/*">
            <Row>
              <Cell ss:StyleID="UnLockedData" ename="OID_BGCopy" nodename="CodeList" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="Name_BGCopy" nodename="CodeList" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="DataType" nodename="CodeList" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="Name_BGCopy" nodename="Alias" tableid="{concat('NCL',position())}" xpath="/CodeList/Alias"/>
              <Cell ss:StyleID="UnLockedData" ename="CodedValue_BGCopy" nodename="CodedValue" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="Name_BGCopy" nodename="Alias" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="TranslatedText_BGCopy" nodename="Decode" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="def:ExtendedValue_BGCopy" nodename="nodename" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="OrderNumber_BGCopy" nodename="nodename" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="Rank_BGCopy" nodename="nodename" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
              <Cell ss:StyleID="UnLockedData" ename="SASFormatName_BGCopy" nodename="CodeList" tableid="{concat('NCL',position())}" xpath="/CodeList"/>

              <Cell ss:StyleID="UnLockedData" ename="DataType_BGCopy" nodename="CodeList" tableid="{concat('NCL',position())}" xpath="/CodeList"/>
            </Row>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R180C11" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C8</Range>
          <Type>List</Type>
          <!--YesEmpty-->
          <Value>=INDIRECT("DDLValues!$F$2:$F$3")</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C3</Range>
          <Type>List</Type>
          <!--DataType-->
          <Value>=INDIRECT("DDLValues!$D$2:$D$4")</Value>
        </DataValidation>

      </Worksheet>

      <!--WhereClause-->

      <Worksheet ss:Name="{'StudyWhereClause'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C6" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:Index="6" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'WhereClauseName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'ItemID'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Comparator'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'CheckValue'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="UnLockedHeader" stylename="NonProtectable">
              <Data ss:Type="String">
                <xsl:value-of select="'Comment'"/>
              </Data>
            </Cell>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/def:WhereClauseDef/*">
            <xsl:variable name="whereClauseName" select="substring-after(../@OID,'.')"/>
            <xsl:variable name="defCommentDefOID" select="../@def:CommentOID"/>
            <xsl:variable name="commentdef">
              <xsl:for-each select="../../def:CommentDef[@OID = $defCommentDefOID]">
                <xsl:value-of select="odm:Description/odm:TranslatedText"/>
              </xsl:for-each>
            </xsl:variable>

            <Row>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="$whereClauseName"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="@def:ItemOID"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="@Comparator"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:CheckValue"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{../@ElementID}" ename="Comment" nodename="WhereClauseDef" tableid="{../@TableID}" xpath="{../@Xpath}" commentoid="{$defCommentDefOID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$commentdef"/>
                </Data>
              </Cell>
              <!--This cell is used to preserve the backend stored data of cell Comment While chaging the dropdown value-->
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{../@ElementID}" ename="Comment_BGCopy" nodename="WhereClauseDef" xpath="{../@Xpath}" tableid="{../@TableID}" commentoid="{$defCommentDefOID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$defCommentDefOID"/>
                </Data>
              </Cell>
            </Row>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>4</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C5" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C5</Range>
          <Type>List</Type>
          <!--<Value>=INDIRECT("StudyComment!$A$2:$A$10")</Value>-->
          <Value>=OFFSET(INDIRECT("StudyComment!$A$2"),0,0,COUNTA(INDIRECT("StudyComment!$A:$A"))-1,1)</Value>
        </DataValidation>
      </Worksheet>

      <!--Comment-->

      <Worksheet ss:Name="{'StudyComment'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C13" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">

          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Backround Details-->
          <Column ss:Index="7" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="8" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="9" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="10" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="11" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="12" ss:Hidden="1" ss:AutoFitWidth="0"/>


          <Row ss:StyleID="UnLockedHeader">
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Description'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DocumentName'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Destination'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Pages'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'FirstPage'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'LastPage'"/>
              </Data>
            </Cell>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/def:CommentDef">
            <xsl:variable name="commentIdentifier" select="substring-after(@OID,'.')"/>


            <xsl:variable name="leafID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@leafID"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="docTitle">
              <xsl:for-each select="../def:leaf[@ID=$leafID]">
                <xsl:value-of select="def:title"/>
              </xsl:for-each>
            </xsl:variable>

            <xsl:variable name="destination">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@Type"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="originPages">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@PageRefs">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@PageRefs"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="firstPage">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@FirstPage">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@FirstPage"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="lastPage">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@LastPage">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@LastPage"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefEID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@ElementID"/>
              </xsl:if>
            </xsl:variable>


            <xsl:variable name="defPDFPageRefEID">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@ElementID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefTID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@TableID"/>
              </xsl:if>
            </xsl:variable>


            <xsl:variable name="defPDFPageRefTableID">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@TableID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefXpath">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@Xpath"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defPDFPageRefXpath">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@Xpath"/>
              </xsl:if>
            </xsl:variable>
            <Row>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Description/odm:TranslatedText/@ElementID}" ename="TranslatedText" nodename="TranslatedText" tableid="{odm:Description/odm:TranslatedText/@TableID}"
							      xpath="{odm:Description/odm:TranslatedText/@Xpath}" ChangedCommentOID="{@OID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defDocumentRefEID}" ename="leafID" nodename="def:leaf" tableid="{$defDocumentRefTID}"
                    xpath="{$defDocumentRefXpath}" ChangedLeafID="{$leafID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$docTitle"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$destination"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$originPages"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$firstPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$lastPage"/>
                </Data>
              </Cell>

              <!--Backround details-->
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Description/odm:TranslatedText/@ElementID}" ename="TranslatedText_BGCopy" nodename="TranslatedText" tableid="{odm:Description/odm:TranslatedText/@TableID}"
							      xpath="{odm:Description/odm:TranslatedText/@Xpath}" ChangedCommentOID="{@OID}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defDocumentRefEID}" ename="leafID_BGCopy" nodename="def:leaf" tableid="{$defDocumentRefTID}" xpath="{$defDocumentRefXpath}" ChangedLeafID="{$leafID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$docTitle"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$destination"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$originPages"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$firstPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$lastPage"/>
                </Data>
              </Cell>
            </Row>
          </xsl:for-each>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemDef">

            <Row>
              <Cell ss:StyleID="UnLockedData" ename="TranslatedText_BGCopy" nodename="TranslatedText" tableid="{concat('NC',position())}" xpath="/CommentDef/Description/TranslatedText"/>
              <Cell ss:StyleID="UnLockedData" ename="leafID" nodename="def:DocumentRef" tableid="{concat('NC',position())}" ChangedLeafID="" xpath="/CommentDef/DocumentRef"/>
              <Cell ss:StyleID="UnLockedData" ename="DestinationType" nodename="def:PDFPageRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="LastPage_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
              <!-- Backround Details-->
              <Cell ss:StyleID="UnLockedData" ename="leafID_BGCopy" nodename="def:DocumentRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef"/>
              <Cell ss:StyleID="UnLockedData" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NC',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
            </Row>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C6" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C2</Range>
          <Type>List</Type>
          <!--DocumentName-->
          <Value>=OFFSET(INDIRECT("StudyDocument!$B$2"),0,0,COUNTA(INDIRECT("StudyDocument!$B:$B"))-1,1)</Value>
        </DataValidation>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C3</Range>
          <Type>List</Type>
          <!--Destination-->
          <Value>=INDIRECT("DDLValues!$C$2:$C$3")</Value>
        </DataValidation>
      </Worksheet>

      <!--Method-->

      <Worksheet ss:Name="{'StudyMethod'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C20" ss:Hidden="1"/>
        </Names>

        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Backroundcopy-->
          <Column ss:Index="11" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="12" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="13" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="14" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="15" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="16" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="17" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="18" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="19" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="20" ss:Hidden="1" ss:AutoFitWidth="0"/>

          <Row ss:StyleID="UnLockedHeader">
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'MethodName'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Description'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DocumentName'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Destination'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Type'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Pages'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'FirstPage'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'LastPage'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'ExpressionCode'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'ExpressionContext'"/>
              </Data>
            </Cell>
          </Row>


          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:MethodDef">
            <xsl:variable name="methodIdentifier" select="substring-after(@OID,'.')"/>

            <xsl:variable name="leafID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@leafID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="docTitle">
              <xsl:for-each select="../def:leaf[@ID=$leafID]">
                <xsl:value-of select="def:title"/>
              </xsl:for-each>
            </xsl:variable>

            <xsl:variable name="destination">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@Type"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="originPages">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@PageRefs">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@PageRefs"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="firstPage">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@FirstPage">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@FirstPage"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="lastPage">
              <xsl:if test="def:DocumentRef/def:PDFPageRef/@LastPage">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@LastPage"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="expressionCode">
              <xsl:if test="odm:FormalExpression">
                <xsl:value-of select="odm:FormalExpression"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="expressionContext">
              <xsl:if test="odm:FormalExpression">
                <xsl:value-of select="odm:FormalExpression/@Context"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefEID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@ElementID"/>
              </xsl:if>
            </xsl:variable>


            <xsl:variable name="defPDFPageRefEID">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@ElementID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="FormalExpressionEID">
              <xsl:if test="odm:FormalExpression">
                <xsl:value-of select="odm:FormalExpression/@ElementID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefTID">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@TableID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defPDFPageRefTableID">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@TableID"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="defDocumentRefXpath">
              <xsl:if test="def:DocumentRef">
                <xsl:value-of select="def:DocumentRef/@Xpath"/>
              </xsl:if>
            </xsl:variable>


            <xsl:variable name="defPDFPageRefXpath">
              <xsl:if test="def:DocumentRef/def:PDFPageRef">
                <xsl:value-of select="def:DocumentRef/def:PDFPageRef/@Xpath"/>
              </xsl:if>
            </xsl:variable>

            <xsl:variable name="FormalExpressionTableID">
              <xsl:if test="odm:FormalExpression">
                <xsl:value-of select="odm:FormalExpression/@TableID"/>
              </xsl:if>
            </xsl:variable>
            <xsl:variable name="FormalExpressionXpath">
              <xsl:if test="odm:FormalExpression">
                <xsl:value-of select="odm:FormalExpression/@Xpath"/>
              </xsl:if>
            </xsl:variable>


            <Row>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Name" nodename="MethodDef" tableid="{@TableID}" xpath="{@Xpath}" ChangedMethodOID="{@OID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Name"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Description/odm:TranslatedText/@ElementID}" ename="TranslatedText" nodename="TranslatedText" tableid="{odm:Description/odm:TranslatedText/@TableID}"
							      xpath="{odm:Description/odm:TranslatedText/@Xpath}">

                <Data ss:Type="String">
                  <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defDocumentRefEID}" ename="leafID" nodename="def:DocumentRef" tableid="{$defDocumentRefTID}" xpath="{$defDocumentRefXpath}"  ChangedLeafID="{$leafID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$docTitle"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$destination"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="MethodType" nodename="MethodDef" tableid="{@TableID}" xpath="{@Xpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Type"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$originPages"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$firstPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$lastPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$FormalExpressionEID}" ename="FormalExpression" nodename="FormalExpression" tableid="{$FormalExpressionTableID}" xpath="{$FormalExpressionXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$expressionCode"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$FormalExpressionEID}" ename="Context" nodename="FormalExpression" tableid="{$FormalExpressionTableID}" xpath="{$FormalExpressionXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$expressionContext"/>
                </Data>
              </Cell>

              <!--Backround Details-->

              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Name_BGCopy" nodename="MethodDef" tableid="{@TableID}" xpath="{@Xpath}" ChangedMethodOID="{@OID}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Name"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{odm:Description/odm:TranslatedText/@ElementID}" ename="TranslatedText_BGCopy" nodename="TranslatedText" tableid="{odm:Description/odm:TranslatedText/@TableID}"
							      xpath="{odm:Description/odm:TranslatedText/@Xpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="odm:Description/odm:TranslatedText"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defDocumentRefEID}" ename="leafID_BGCopy" nodename="def:DocumentRef" tableid="{$defDocumentRefTID}" xpath="{$defDocumentRefXpath}" ChangedLeafID="{$leafID}">
                <Data ss:Type="String">
                  <xsl:value-of select="$docTitle"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$destination"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="MethodType_BGCopy" nodename="MethodDef" tableid="{@TableID}" xpath="{@Xpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="@Type"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$originPages"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$firstPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$defPDFPageRefEID}" ename="LastPage_BGCopy" nodename="def:PDFPageRef" tableid="{$defPDFPageRefTableID}" xpath="{$defPDFPageRefXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$lastPage"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$FormalExpressionEID}" ename="FormalExpression_BGCopy" nodename="FormalExpression" tableid="{$FormalExpressionTableID}" xpath="{$FormalExpressionXpath}">
                <Data ss:Type="String">
                  <xsl:value-of select="$expressionCode"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$FormalExpressionEID}" ename="Context_BGCopy" nodename="FormalExpression" tableid="{$FormalExpressionTableID}" xpath="{$FormalExpressionXpath}">

                <Data ss:Type="String">
                  <xsl:value-of select="$expressionContext"/>
                </Data>
              </Cell>
            </Row>
          </xsl:for-each>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemDef">

            <Row>
              <Cell ss:StyleID="UnLockedData" ename="Name_BGCopy" nodename="MethodDef" tableid="{concat('NM',position())}" xpath="/MethodDef"/>
              <Cell ss:StyleID="UnLockedData" ename="TranslatedText_BGCopy" nodename="TranslatedText" tableid="{concat('NM',position())}" xpath="/MethodDef/Description/TranslatedText"/>
              <Cell ss:StyleID="UnLockedData" ename="leafID" nodename="def:DocumentRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef" ChangedLeafID=""/>
              <Cell ss:StyleID="UnLockedData" ename="DestinationType" nodename="def:PDFPageRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="MethodType" nodename="MethodDef" tableid="{concat('NM',position())}" xpath="/MethodDef"/>
              <Cell ss:StyleID="UnLockedData" ename="PageRefs_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="FirstPage_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="LastPage_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="FormalExpression_BGCopy" nodename="FormalExpression" tableid="{concat('NM',position())}" xpath="/MethodDef/FormalExpression"/>
              <Cell ss:StyleID="UnLockedData" ename="Context_BGCopy" nodename="FormalExpression" tableid="{concat('NM',position())}" xpath="/MethodDef/FormalExpression"/>
              <!--Backround Details-->
              <Cell ss:StyleID="UnLockedData" ename="leafID_BGCopy" nodename="def:DocumentRef" tableid="{concat('NM',position())}" xpath="/MethodDef/DocumentRef"/>
              <Cell ss:StyleID="UnLockedData" ename="DestinationType_BGCopy" nodename="def:PDFPageRef" tableid="{concat('NM',position())}" xpath="/CommentDef/DocumentRef/PDFPageRef"/>
              <Cell ss:StyleID="UnLockedData" ename="MethodType_BGCopy" nodename="MethodDef" tableid="{concat('NM',position())}" xpath="/MethodDef"/>

            </Row>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
          </Panes>

          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C10" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C3</Range>
          <Type>List</Type>
          <!--DocumentName-->
          <Value>=OFFSET(INDIRECT("StudyDocument!$B$2"),0,0,COUNTA(INDIRECT("StudyDocument!$B:$B"))-1,1)</Value>
        </DataValidation>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C4</Range>
          <Type>List</Type>
          <!--Destination-->
          <Value>=INDIRECT("DDLValues!$C$2:$C$3")</Value>
        </DataValidation>

        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C5</Range>
          <Type>List</Type>
          <!--MethodType-->
          <Value>=INDIRECT("DDLValues!$E$2:$E$3")</Value>
        </DataValidation>
      </Worksheet>

      <!--Document-->

      <Worksheet ss:Name="{'StudyDocument'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C3" ss:Hidden="1"/>
        </Names>
        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>

          <Row>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DocumentName'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DocumentTitle'"/>
              </Data>
            </Cell>
            <Cell ss:StyleID="LockedHeader" stylename="Protectable">
              <Data ss:Type="String">
                <xsl:value-of select="'DocumentType'"/>
              </Data>
            </Cell>
          </Row>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/def:leaf">
            <xsl:variable name="defleafID" select="@ID"/>

            <xsl:variable name="defLeafType">
              <xsl:choose>
                <xsl:when test="../def:AnnotatedCRF/def:DocumentRef[@leafID=$defleafID]">
                  <xsl:value-of select="'AnnotatedCRF'"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:for-each select="../def:SupplementalDoc/def:DocumentRef[@leafID=$defleafID]">
                    <xsl:value-of select="'SupplementalDoc'"/>
                  </xsl:for-each>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:variable>

            <Row>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="substring-before(@xlink:href,'.')"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable" id="{@ElementID}" ename="DocumentLeafID" nodename="def:leaf" tableid="{@TableID}" xpath="{@Xpath}" ChangedLeafID="{@ID}">
                <Data ss:Type="String">
                  <xsl:value-of select="def:title"/>
                </Data>
              </Cell>
              <Cell ss:StyleID="LockedData" stylename="Protectable">
                <Data ss:Type="String">
                  <xsl:value-of select="$defLeafType"/>
                </Data>
              </Cell>

            </Row>
          </xsl:for-each>
        </Table>

        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>3</ActiveCol>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
            </Pane>
          </Panes>
          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C3" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>

      </Worksheet>

      <!--ExternalCodeList-->

      <Worksheet ss:Name="{'StudyDictionary'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C10" ss:Hidden="1"/>
        </Names>

        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <!--Backround Details-->
          <Column ss:Index="6" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="7" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="8" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="9" ss:Hidden="1" ss:AutoFitWidth="0"/>
          <Column ss:Index="10" ss:Hidden="1" ss:AutoFitWidth="0"/>

          <Row ss:StyleID="UnLockedHeader">
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DictionaryValueID'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DictionaryLabel'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DataType'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DictionaryName'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DictionaryVersion'"/>
              </Data>
            </Cell>
          </Row>


          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:CodeList/*">
            <xsl:if test="local-name() != 'CodeListItem' and local-name() != 'EnumeratedItem' and local-name() != 'Alias'">

              <xsl:variable name="CLEID">
                <xsl:value-of select="../@ElementID"/>
              </xsl:variable>

              <xsl:variable name="CLTID">
                <xsl:value-of select="../@TableID"/>
              </xsl:variable>

              <xsl:variable name="CLXpath">
                <xsl:value-of select="../@Xpath"/>
              </xsl:variable>

              <xsl:variable name="codelistOID" select="../@OID"/>
              <xsl:variable name="testfordoubledot" select="substring-after(../@OID,'.')"/>

              <xsl:variable name="dictionaryValueID">
                <xsl:choose>
                  <xsl:when test="contains($testfordoubledot,'.')">
                    <xsl:value-of select="substring-after($testfordoubledot,'.')"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="$testfordoubledot"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:variable>

              <Row>
                <Cell ss:StyleID="LockedData" stylename="NonProtectable" id="{$CLEID}" ename="OID" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}"  ChangedCodeListOID="{$dictionaryValueID}" >
                  <Data ss:Type="String">
                    <xsl:value-of select="$dictionaryValueID"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$CLEID}" ename="Name" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@Name"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$CLEID}" ename="DataType" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@DataType"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Dictionary" nodename="ExternalCodeList" tableid="{@TableID}" xpath="{@Xpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="@Dictionary"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Version" nodename="ExternalCodeList" tableid="{@TableID}" xpath="{@Xpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="@Version"/>
                  </Data>
                </Cell>

                <!--Backround Details-->
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$CLEID}" ename="OID_BGCopy" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}" ChangedCodeListOID="{$dictionaryValueID}">
                  <Data ss:Type="String">
                    <xsl:value-of select="$dictionaryValueID"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$CLEID}" ename="Name_BGCopy" nodename="CodeList" tableid="{$CLTID}" xpath="{$CLXpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@Name"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{$CLEID}" ename="DataType_BGCopy" nodename="CodeList" tableid="{$CLTID}" xpath="{@Xpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="../@DataType"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Dictionary_BGCopy" nodename="ExternalCodeList" tableid="{@TableID}" xpath="{@Xpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="@Dictionary"/>
                  </Data>
                </Cell>
                <Cell ss:StyleID="UnLockedData" stylename="NonProtectable" id="{@ElementID}" ename="Version_BGCopy" nodename="ExternalCodeList" tableid="{@TableID}" xpath="{@Xpath}">
                  <Data ss:Type="String">
                    <xsl:value-of select="@Version"/>
                  </Data>
                </Cell>
              </Row>
            </xsl:if>
          </xsl:for-each>

          <xsl:for-each select="odm:Study/odm:MetaDataVersion/odm:ItemDef">
            <Row>
              <Cell ss:StyleID="UnLockedData" ename="OID_BGCopy" nodename="CodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>
              <Cell ss:StyleID="UnLockedData" ename="Name_BGCopy" nodename="CodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>
              <Cell ss:StyleID="UnLockedData" ename="DataType" nodename="CodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>
              <Cell ss:StyleID="UnLockedData" ename="Dictionary_BGCopy" nodename="ExternalCodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>
              <Cell ss:StyleID="UnLockedData" ename="Version_BGCopy" nodename="ExternalCodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>

              <Cell ss:StyleID="UnLockedData" ename="DataType_BGCopy" nodename="CodeList" tableid="{concat('NECL',position())}" xpath="/Dictionary"/>
            </Row>
          </xsl:for-each>
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
          </Panes>

          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C5" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>
        <DataValidation xmlns="urn:schemas-microsoft-com:office:excel">
          <Range>C3</Range>
          <Type>List</Type>
          <!--DataType-->
          <Value>=INDIRECT("DDLValues!$D$2:$D$4")</Value>
        </DataValidation>
      </Worksheet>

      <!--DDLSheet====>Hidden-->

      <Worksheet ss:Name="{'DDLValues'}" ss:Protected="1">
        <Names>
          <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=Sheet1!R1C1:R1C8" ss:Hidden="1"/>
        </Names>

        <Table x:FullColumns="1" x:FullRows="1">
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="200"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>
          <Column ss:AutoFitWidth="1" ss:Width="100"/>

          <Row ss:StyleID="UnLockedHeader">
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'YesNO'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Origin'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'Destination'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'DataType'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'MethodType'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'YesEmpty'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'AliasContext'"/>
              </Data>
            </Cell>
            <Cell>
              <Data ss:Type="String">
                <xsl:value-of select="'CodeListType'"/>
              </Data>
            </Cell>
          </Row>


          <Row ss:Index="2">
            <Cell ss:Index="1" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesNoDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Yes'"/>
              </Data>
            </Cell>
            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'CRF'"/>
              </Data>
            </Cell>
            <Cell ss:Index="3" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="DestinationDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'NamedDestination'"/>
              </Data>
            </Cell>
            <Cell ss:Index="4" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="DataTypeDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'text'"/>
              </Data>
            </Cell>
            <Cell ss:Index="5" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="MethodDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Imputation'"/>
              </Data>
            </Cell>
            <Cell ss:Index="6" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesEmptyDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Yes'"/>
              </Data>
            </Cell>
            <Cell ss:Index="7" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesEmptyDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'DomainDescription'"/>
              </Data>
            </Cell>
            <Cell ss:Index="8" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="CodeListTypeDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Codelist'"/>
              </Data>
            </Cell>
          </Row>
          <Row ss:Index="3">
            <Cell ss:Index="1" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesNoDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'No'"/>
              </Data>
            </Cell>
            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Protocol'"/>
              </Data>
            </Cell>
            <Cell ss:Index="3" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="DestinationDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'PhysicalRef'"/>
              </Data>
            </Cell>
            <Cell ss:Index="4" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="DataTypeDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'float'"/>
              </Data>
            </Cell>
            <Cell ss:Index="5" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="MethodDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Computation'"/>
              </Data>
            </Cell>
            <Cell ss:Index="6" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesEmptyDDL">
              <Data ss:Type="String">
                <xsl:value-of select="''"/>
              </Data>
            </Cell>
            <Cell ss:Index="7" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="YesEmptyDDL">
              <Data ss:Type="String">
                <xsl:value-of select="''"/>
              </Data>
            </Cell>
           <Cell ss:Index="8" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="CodeListTypeDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Dictionary'"/>
              </Data>
            </Cell>
          </Row>
          <Row ss:Index="4">

            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Assigned'"/>
              </Data>
            </Cell>

            <Cell ss:Index="4" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="DataTypeDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'integer'"/>
              </Data>
            </Cell>
          </Row>
          <Row ss:Index="5">

            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Derived'"/>
              </Data>
            </Cell>
          </Row>
          <Row ss:Index="6">

            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'eDT'"/>
              </Data>
            </Cell>
          </Row>
          <Row ss:Index="7">

            <Cell ss:Index="2" ss:StyleID="UnLockedData" stylename="NonProtectable" ename="OriginDDL">
              <Data ss:Type="String">
                <xsl:value-of select="'Predecessor'"/>
              </Data>
            </Cell>
          </Row>

        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <PageSetup>
            <Header x:Margin="0.3"/>
            <Footer x:Margin="0.3"/>
            <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
          </PageSetup>
          <Selected/>
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <SplitVertical>2</SplitVertical>
          <LeftColumnRightPane>2</LeftColumnRightPane>
          <ActivePane>0</ActivePane>
          <Panes>
            <Pane>
              <Number>3</Number>
            </Pane>
            <Pane>
              <Number>1</Number>
            </Pane>
            <Pane>
              <Number>2</Number>
            </Pane>
            <Pane>
              <Number>0</Number>
              <ActiveRow>1</ActiveRow>
              <ActiveCol>0</ActiveCol>
            </Pane>
          </Panes>

          <ProtectObjects>False</ProtectObjects>
          <ProtectScenarios>False</ProtectScenarios>
          <Visible>SheetHidden</Visible>
        </WorksheetOptions>
        <AutoFilter x:Range="R1C1:R100C7" xmlns="urn:schemas-microsoft-com:office:excel">
        </AutoFilter>
      </Worksheet>

    </Workbook>
  </xsl:template>
</xsl:stylesheet>