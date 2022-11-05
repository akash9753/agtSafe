<!-- 
XSLT to generate DataTable for Updated Columns of imported DefineXML 

  11/23/2018          Vijayalakshmi G         
-->
<xsl:stylesheet xmlns:x="urn:schemas-microsoft-com:office:excel" exclude-result-prefixes="html o ss x" xmlns:o="urn:schemas-microsoft-com:office:office" version="1.0" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:y="urn:schemas-microsoft-com:office:spreadsheet">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <importexceldata>
      <xsl:for-each select="y:Workbook/y:Worksheet">
        <xsl:choose>
          <xsl:when test="@ss:Name='Study'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="styStudyDescription">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='2'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="stySponsorName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='3'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="styProtocolName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='4'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:for-each select="y:Cell">


                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='Originator_BGCopy'">
                        <xsl:value-of select="'True'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'False'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='StudyDescription_BGCopy'">
                        <xsl:value-of select="$styStudyDescription"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Originator_BGCopy'">
                            <xsl:value-of select="$stySponsorName"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='ProtocolName_BGCopy'">
                                <xsl:value-of select="$styProtocolName"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="y:Data"/>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:value-of select="substring-before(@ename,'_')"/>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyDomainMetaData-->
          <xsl:when test="@ss:Name='StudyDomainMetaData'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="dmnReapting">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='5'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dmnReferenceData">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='6'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dmnStructure">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='7'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dmnKeyVariable">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='8'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dmnAliasContext">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='9'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dmnAliasName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='10'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed commentOID-->
              <xsl:variable name="changedCommentoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='TranslatedText'">
                    <xsl:value-of select="@ChangedCommentOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed comment but has not CommentOID since its newly added on Comment sheet-->
              <xsl:variable name="changedTranslatedText">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:if test="position()='11'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old commentvalue-->
              <xsl:variable name="oldCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Comment'">
                    <xsl:value-of select="@commentoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:for-each select="y:Cell">

                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="((@ename='AliasContext') or (@ename='AliasName'))">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:choose>
                          <xsl:when test="$changedCommentoid!=''">
                            <xsl:value-of select="$changedCommentoid"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="$changedTranslatedText!=''">
                                <xsl:value-of select="$changedTranslatedText"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="((@commentoid !='') and (@commentoid = $oldCommentValue))">
                                    <xsl:value-of select="$oldCommentValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:value-of select="''"/>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Repeating_BGCopy'">
                            <xsl:value-of select="$dmnReapting"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='IsReferenceData_BGCopy'">
                                <xsl:value-of select="$dmnReferenceData"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='def:Structure_BGCopy'">
                                    <xsl:value-of select="$dmnStructure"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='KeyVariable_BGCopy'">
                                        <xsl:value-of select="$dmnKeyVariable"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='Context_BGCopy'">
                                            <xsl:value-of select="$dmnAliasContext"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:choose>
                                              <xsl:when test="@ename='Name_BGCopy'">
                                                <xsl:value-of select="$dmnAliasName"/>
                                              </xsl:when>
                                              <xsl:otherwise>
                                                <xsl:value-of select="y:Data"/>
                                              </xsl:otherwise>
                                            </xsl:choose>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:value-of select="'CommentOID'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="substring-before(@ename,'_')"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyVariableLevelMetaData-->
          <xsl:when test="@ss:Name='StudyVariableLevelMetaData'">
            <xsl:for-each select="y:Table/y:Row">

              <!--to get the changed commentOID-->
              <xsl:variable name="changedCommentoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='TranslatedText'">
                    <xsl:value-of select="@ChangedCommentOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed MethodOID-->
              <xsl:variable name="changedMethodoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@nodename='MethodDef'">
                    <xsl:value-of select="@ChangedMethodOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed CodeListOID-->
              <xsl:variable name="changedCodeListoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='OID'">
                    <xsl:value-of select="@ChangedCodeListOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed comment but has not CommentOID since its newly added on Comment sheet-->
              <xsl:variable name="changedCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:if test="position()='16'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed CodeList but has not CodeListOID since its newly added on CodeList sheet-->
              <xsl:variable name="changedCodeListValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="not(@id)"> <!--and not(@stylename)-->
                    <xsl:if test="position()='18'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed Method but has not MethodOID since its newly added on Method sheet-->
              <xsl:variable name="changedMethodValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:if test="position()='19'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old commentvalue-->
              <xsl:variable name="oldCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Comment'">
                    <xsl:value-of select="@commentoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old methodvalue-->
              <xsl:variable name="oldMethodValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Method'">
                    <xsl:value-of select="@methodoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old codelistvalue-->
              <xsl:variable name="oldCodeListValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='CodeListOID'">
                    <xsl:value-of select="@codelistoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="varOrigin">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='12'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="varPages">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='13'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="varFirstPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='14'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="varLastPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='15'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="varDestination">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='20'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>


              <xsl:for-each select="y:Cell">
                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and contains(@ename,'_BGCopy'))">

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:choose>
                          <xsl:when test="$changedCommentoid!=''">
                            <xsl:value-of select="$changedCommentoid"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="$changedCommentValue!=''">
                                <xsl:value-of select="$changedCommentValue"/>
                              </xsl:when>
                              <xsl:otherwise>

                                <xsl:choose>
                                  <xsl:when test="@commentoid !='' and @commentoid = $oldCommentValue">
                                    <xsl:value-of select="$oldCommentValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:value-of select="''"/>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Method_BGCopy'">
                            <xsl:choose>
                              <xsl:when test="$changedMethodoid!=''">
                                <xsl:value-of select="$changedMethodoid"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="$changedMethodValue!=''">
                                    <xsl:value-of select="$changedMethodValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>


                                    <xsl:choose>
                                      <xsl:when test="@methodoid !='' and @methodoid = $oldMethodValue">
                                        <xsl:value-of select="$oldMethodValue"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:value-of select="''"/>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='CodeListOID_BGCopy'">
                                <xsl:choose>
                                  <xsl:when test="$changedCodeListoid!=''">
                                    <xsl:value-of select="$changedCodeListoid"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="$changedCodeListValue!=''">
                                        <xsl:value-of select="$changedCodeListValue"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@codelistoid !='' and @codelistoid = $oldCodeListValue">
                                            <xsl:value-of select="$oldCodeListValue"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:value-of select="''"/>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='OriginType_BGCopy'">
                                    <xsl:value-of select="$varOrigin"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='PageRefs_BGCopy'">
                                        <xsl:value-of select="$varPages"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='FirstPage_BGCopy'">
                                            <xsl:value-of select="$varFirstPage"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:choose>
                                              <xsl:when test="@ename='LastPage_BGCopy'">
                                                <xsl:value-of select="$varLastPage"/>
                                              </xsl:when>
                                              <xsl:otherwise>
                                                <xsl:choose>
                                                  <xsl:when test="@ename='DestinationType_BGCopy'">
                                                    <xsl:value-of select="$varDestination"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                    <xsl:value-of select="y:Data"/>
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                              </xsl:otherwise>
                                            </xsl:choose>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="((@ename='OriginType_BGCopy') or (@ename='DestinationType_BGCopy'))">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Comment_BGCopy'">
                            <xsl:value-of select="'CommentOID'"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='Method_BGCopy'">
                                <xsl:value-of select="'MethodOID'"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="substring-before(@ename,'_')"/>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyValueLevelMetaData-->
          <xsl:when test="@ss:Name='StudyValueLevelMetaData'">
            <xsl:for-each select="y:Table/y:Row">

              <!--to get the changed commentOID-->
              <xsl:variable name="changedCommentoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='TranslatedText'">
                    <xsl:value-of select="@ChangedCommentOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <!--to get the changed MethodOID-->
              <xsl:variable name="changedMethodoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@nodename='MethodDef'">
                    <xsl:value-of select="@ChangedMethodOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <!--to get the changed CodeListOID-->
              <xsl:variable name="changedCodeListoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='OID'">
                    <xsl:value-of select="@ChangedCodeListOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed comment but has not CommentOID since its newly added on Comment sheet-->
              <xsl:variable name="changedCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:if test="position()='14'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed CodeList but has not CodeListOID since its newly added on CodeList sheet-->
              <xsl:variable name="changedCodeListValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id)) "><!--and not(@stylename)-->
                    <xsl:if test="position()='16'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed Method but has not MethodOID since its newly added on Method sheet-->
              <xsl:variable name="changedMethodValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:if test="position()='17'">
                      <xsl:value-of select="y:Data"/>
                    </xsl:if>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old commentvalue-->
              <xsl:variable name="oldCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Comment'">
                    <xsl:value-of select="@commentoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old methodvalue-->
              <xsl:variable name="oldMethodValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Method'">
                    <xsl:value-of select="@methodoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get old codelistvalue-->
              <xsl:variable name="oldCodeListValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='CodeListOID'">
                    <xsl:value-of select="@codelistoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="valOrigin">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='10'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="valPages">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='11'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="valFirstPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='12'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="valLastPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='13'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="valMandatory">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='18'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="valDestination">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='19'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>


              <xsl:for-each select="y:Cell">

                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:choose>
                          <xsl:when test="$changedCommentoid!=''">
                            <xsl:value-of select="$changedCommentoid"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="$changedCommentValue!=''">
                                <xsl:value-of select="$changedCommentValue"/>
                              </xsl:when>
                              <xsl:otherwise>

                                <xsl:choose>
                                  <xsl:when test="@commentoid !='' and @commentoid = $oldCommentValue">
                                    <xsl:value-of select="$oldCommentValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:value-of select="''"/>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Method_BGCopy'">
                            <xsl:choose>
                              <xsl:when test="$changedMethodoid!=''">
                                <xsl:value-of select="$changedMethodoid"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="$changedMethodValue!=''">
                                    <xsl:value-of select="$changedMethodValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>


                                    <xsl:choose>
                                      <xsl:when test="@methodoid !='' and @methodoid = $oldMethodValue">
                                        <xsl:value-of select="$oldMethodValue"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:value-of select="''"/>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='CodeListOID_BGCopy'">
                                <xsl:choose>
                                  <xsl:when test="$changedCodeListoid!=''">
                                    <xsl:value-of select="$changedCodeListoid"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="$changedCodeListValue!=''">
                                        <xsl:value-of select="$changedCodeListValue"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@codelistoid !='' and @codelistoid = $oldCodeListValue">
                                            <xsl:value-of select="$oldCodeListValue"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:value-of select="''"/>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='OriginType_BGCopy'">
                                    <xsl:value-of select="$valOrigin"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='PageRefs_BGCopy'">
                                        <xsl:value-of select="$valPages"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='FirstPage_BGCopy'">
                                            <xsl:value-of select="$valFirstPage"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:choose>
                                              <xsl:when test="@ename='LastPage_BGCopy'">
                                                <xsl:value-of select="$valLastPage"/>
                                              </xsl:when>
                                              <xsl:otherwise>
                                                <xsl:choose>
                                                  <xsl:when test="@ename='DestinationType_BGCopy'">
                                                    <xsl:value-of select="$valDestination"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                    <xsl:choose>
                                                      <xsl:when test="@ename='Mandatory_BGCopy'">
                                                        <xsl:value-of select="$valMandatory"/>
                                                      </xsl:when>
                                                      <xsl:otherwise>
                                                        <xsl:value-of select="y:Data"/>
                                                      </xsl:otherwise>
                                                    </xsl:choose>
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                              </xsl:otherwise>
                                            </xsl:choose>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>



                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="((@ename='OriginType_BGCopy') or (@ename='DestinationType_BGCopy'))">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Comment_BGCopy'">
                            <xsl:value-of select="'CommentOID'"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='Method_BGCopy'">
                                <xsl:value-of select="'MethodOID'"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:value-of select="substring-before(@ename,'_')"/>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyCodeList-->
          <xsl:when test="@ss:Name='CodeList'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="clTerm">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='5'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="clDecodedValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='7'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="clIsExtensible">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='8'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="clOrderNumber">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='9'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="clRank">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='10'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="clDataType">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='3'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="newTableID">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1' and y:Data!=''">
                    <xsl:value-of select="@tableid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="doctypexpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DataType_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:for-each select="y:Cell">
                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='CodedValue_BGCopy'">
                        <xsl:value-of select="$clTerm"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='TranslatedText_BGCopy'">
                            <xsl:value-of select="$clDecodedValue"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='def:ExtendedValue_BGCopy'">
                                <xsl:value-of select="$clIsExtensible"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='OrderNumber_BGCopy'">
                                    <xsl:value-of select="$clOrderNumber"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='Rank_BGCopy'">
                                        <xsl:value-of select="$clRank"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:value-of select="y:Data"/>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:value-of select="substring-before(@ename,'_')"/>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>

                <xsl:if test="((not(@id)) and (y:Data!='') and((@tableid!='') or contains(@ename,'DDL')))">
                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='CodedValue_BGCopy'">
                        <xsl:value-of select="$clTerm"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='TranslatedText_BGCopy'">
                            <xsl:value-of select="$clDecodedValue"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='YesEmptyDDL'">
                                <xsl:value-of select="$clIsExtensible"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='OrderNumber_BGCopy'">
                                    <xsl:value-of select="$clOrderNumber"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='Rank_BGCopy'">
                                        <xsl:value-of select="$clRank"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='DataTypeDDL'">
                                            <xsl:value-of select="$clDataType"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:value-of select="y:Data"/>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select="'DataType'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='YesEmptyDDL'">
                            <xsl:value-of select="'def:ExtendedValue'"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:value-of select="substring-before(@ename,'_')"/>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="TableID">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL' or @ename='YesEmptyDDL'">
                        <xsl:value-of select="$newTableID"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="@tableid"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="NodeName">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL' or @ename='YesEmptyDDL'">
                        <xsl:value-of select="'CodeList'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="@nodename"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name ="XPath">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select ="$doctypexpath"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select ="@xpath"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$TableID"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="$NodeName"/>
                    <xsl:with-param name="Xpath" select="$XPath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudywhereClauseDef-->
          <xsl:when test="@ss:Name='StudyWhereClause'">
            <xsl:for-each select="y:Table/y:Row">

              <!--to get the changed commentOID-->
              <xsl:variable name="changedCommentoid">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='TranslatedText'">
                    <xsl:value-of select="@ChangedCommentOID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the changed comment but has not CommentOID since its newly added on Comment sheet-->
              <xsl:variable name="changedTranslatedText">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="(not(@id) and not(@stylename))">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <!--to get the old commentvalue-->
              <xsl:variable name="oldCommentValue">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='Comment'">
                    <xsl:value-of select="@commentoid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:for-each select="y:Cell">

                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:choose>
                          <xsl:when test="$changedCommentoid!=''">
                            <xsl:value-of select="$changedCommentoid"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="$changedTranslatedText!=''">
                                <xsl:value-of select="$changedTranslatedText"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@commentoid !='' and @commentoid = $oldCommentValue">
                                    <xsl:value-of select="$oldCommentValue"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:value-of select="''"/>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="y:Data"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='Comment_BGCopy'">
                        <xsl:value-of select="'CommentOID'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="substring-before(@ename,'_')"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyComment-->
          <xsl:when test="@ss:Name='StudyComment'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="cmtDescription">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="cmtDocumentName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='2'">
                    <xsl:value-of select="@ChangedLeafID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
             
              <xsl:variable name="cmtDestination">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='3'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="cmtPages">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='4'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="cmtFirstPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='5'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="cmtLastPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='6'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>             
              
              <xsl:variable name="newTableID">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1' and y:Data!=''">
                    <xsl:value-of select="@tableid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
               <xsl:variable name="docleafxpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='leafID_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="docleafnodename">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='leafID_BGCopy'">
                    <xsl:value-of select="@nodename"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
               <xsl:variable name="destnxpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DestinationType_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="destnnodename">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DestinationType_BGCopy'">
                    <xsl:value-of select="@nodename"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
                
              <xsl:for-each select="y:Cell">

                <xsl:if test="((@id) and (@id !='') and (y:Data!='') and (contains(@ename,'_BGCopy')))">
                  
                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationType_BGCopy'">
                        <xsl:value-of select="$cmtDestination"/>
                      </xsl:when>
                     
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='TranslatedText_BGCopy'">
                            <xsl:value-of select="$cmtDescription"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='leafID_BGCopy'">                                
                                <xsl:value-of select="$cmtDocumentName"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='PageRefs_BGCopy'">
                                    <xsl:value-of select="$cmtPages"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='FirstPage_BGCopy'">
                                        <xsl:value-of select="$cmtFirstPage"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='LastPage_BGCopy'">
                                            <xsl:value-of select="$cmtLastPage"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:value-of select="y:Data"/>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationType_BGCopy'">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>                      
                        <xsl:value-of select="substring-before(@ename,'_')"/>                     
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>


                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                </xsl:if>
                  
                
                <xsl:if test="(contains(@stylename,'Protectable') and (@id) and (@id !='') and (@ename='DocumentLeafID'))"> 

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$newTableID"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="'leafID'"/>
                    <xsl:with-param name="AttributeValue" select="@ChangedLeafID"/>
                    <xsl:with-param name="NodeName" select="$docleafnodename"/>
                    <xsl:with-param name="Xpath" select="$docleafxpath"/>
                  </xsl:call-template>
                
                </xsl:if>

                <xsl:if test="((not(@id)) and (y:Data!='') and (contains(@ename,'DDL')))">
                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$newTableID"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="'Type'"/>
                    <xsl:with-param name="AttributeValue" select="y:Data"/>
                    <xsl:with-param name="NodeName" select="$destnnodename"/>
                    <xsl:with-param name="Xpath" select="$destnxpath"/>
                  </xsl:call-template>
                </xsl:if>
                
                 <xsl:if test="((not(@id)) and (y:Data!='') and (@tableid!='') and (contains(@ename,'_BGCopy')))">
                   
                       <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

               
                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationType_BGCopy'">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>                        
                            <xsl:value-of select="substring-before(@ename,'_')"/>                         
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>  

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="y:Data"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                </xsl:if>
                  

                <xsl:text/>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyMethod-->
          <xsl:when test="@ss:Name='StudyMethod'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="mthdMethodName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdDescription">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='2'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdDocumentName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='3'">
                    <xsl:value-of select="@ChangedLeafID"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdDestination">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='4'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdType">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='5'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdPages">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='6'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdFirstPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='7'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdLastPage">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='8'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdExpressionCode">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='9'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="mthdExpressionContext">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='10'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
<xsl:variable name="newTableID">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1' and y:Data!=''">
                    <xsl:value-of select="@tableid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
               <xsl:variable name="docleafxpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='leafID_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="docleafnodename">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='leafID_BGCopy'">
                    <xsl:value-of select="@nodename"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
               <xsl:variable name="destnxpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DestinationType_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="destnnodename">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DestinationType_BGCopy'">
                    <xsl:value-of select="@nodename"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
 <xsl:variable name="mTypexpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='MethodType_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="mTypenodename">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='MethodType_BGCopy'">
                    <xsl:value-of select="@nodename"/>
                  </xsl:if>
                </xsl:for-each> 
              </xsl:variable>
              <xsl:for-each select="y:Cell">

              <xsl:if test="((@id) and (@id !='') and (y:Data!='') and (contains(@ename,'_BGCopy')))">

                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy' or @ename='FormalExpression_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='Name_BGCopy'">
                        <xsl:value-of select="$mthdMethodName"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='DestinationType_BGCopy'">
                            <xsl:value-of select="$mthdDestination"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='TranslatedText_BGCopy'">
                                <xsl:value-of select="$mthdDescription"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='leafID_BGCopy'">
                                    <xsl:value-of select="@LeafID"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='PageRefs_BGCopy'">
                                        <xsl:value-of select="$mthdPages"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:choose>
                                          <xsl:when test="@ename='FirstPage_BGCopy'">
                                            <xsl:value-of select="$mthdFirstPage"/>
                                          </xsl:when>
                                          <xsl:otherwise>
                                            <xsl:choose>
                                              <xsl:when test="@ename='LastPage_BGCopy'">
                                                <xsl:value-of select="$mthdLastPage"/>
                                              </xsl:when>
                                              <xsl:otherwise>
                                                <xsl:choose>
                                                  <xsl:when test="@ename='MethodType_BGCopy'">
                                                    <xsl:value-of select="$mthdType"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                    <xsl:choose>
                                                      <xsl:when test="@ename='FormalExpression_BGCopy'">
                                                        <xsl:value-of select="$mthdExpressionCode"/>
                                                      </xsl:when>
                                                      <xsl:otherwise>
                                                        <xsl:choose>
                                                          <xsl:when test="@ename='Context_BGCopy'">
                                                            <xsl:value-of select="$mthdExpressionContext"/>
                                                          </xsl:when>
                                                          <xsl:otherwise>
                                                            <xsl:value-of select="y:Data"/>
                                                          </xsl:otherwise>
                                                        </xsl:choose>
                                                      </xsl:otherwise>
                                                    </xsl:choose>
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                              </xsl:otherwise>
                                            </xsl:choose>
                                          </xsl:otherwise>
                                        </xsl:choose>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationType_BGCopy'">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='MethodType_BGCopy'">
                            <xsl:value-of select="'MethodType'"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:value-of select="substring-before(@ename,'_')"/>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
                
                <xsl:if test="(contains(@stylename,'Protectable') and (@id) and (@id !='') and (@ename='DocumentLeafID'))"> 

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$newTableID"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="'leafID'"/>
                    <xsl:with-param name="AttributeValue" select="@ChangedLeafID"/>
                    <xsl:with-param name="NodeName" select="$docleafnodename"/>
                    <xsl:with-param name="Xpath" select="$docleafxpath"/>
                  </xsl:call-template>
                
                </xsl:if>
                
                <xsl:if test="((not(@id)) and (y:Data!='') and (contains(@ename,'DDL')))">
                  <xsl:variable name ="elementname">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationDDL'">
                        <xsl:value-of select ="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:if test ="@ename='MethodDDL'">
                          <xsl:value-of select ="'MethodType'"/>
                        </xsl:if>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name ="XPath">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationDDL'">
                        <xsl:value-of select ="$destnxpath"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:if test ="@ename='MethodDDL'">
                          <xsl:value-of select ="$mTypexpath"/>
                        </xsl:if>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  
                      <xsl:variable name ="nodeName">
                    <xsl:choose>
                    <xsl:when test="@ename='DestinationDDL'">
                      <xsl:value-of select ="$destnnodename"/>                    
                    </xsl:when>
                  <xsl:otherwise>
                    <xsl:if test ="@ename='MethodDDL'">
                      <xsl:value-of select ="$mTypenodename"/>
                    </xsl:if>                  
                    </xsl:otherwise>  
                  </xsl:choose>
                  
                  </xsl:variable>
                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$newTableID"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementname"/>
                    <xsl:with-param name="AttributeValue" select="y:Data"/>
                    <xsl:with-param name="NodeName" select="$nodeName"/>
                    <xsl:with-param name="Xpath" select="$XPath"/>
                  </xsl:call-template>
                </xsl:if>

                 <xsl:if test="((not(@id)) and (y:Data!='') and (@tableid!='') and (contains(@ename,'_BGCopy')))">
               
                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@ename='TranslatedText_BGCopy' or @ename='FormalExpression_BGCopy'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

               
                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DestinationType_BGCopy'">
                        <xsl:value-of select="'Type'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='MethodType_BGCopy'">
                            <xsl:value-of select="'MethodType'"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:value-of select="substring-before(@ename,'_')"/>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>  
                  


                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="''"/>
                    <xsl:with-param name="IsAttribute" select="$isattribute"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="y:Data"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
  </xsl:if>   
                
              <xsl:text/>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <!--StudyDocument-->
         <!--No update in this sheet-->

          <!--StudyDictionary-->
          <xsl:when test="@ss:Name='StudyDictionary'">
            <xsl:for-each select="y:Table/y:Row">

              <xsl:variable name="dicDataType">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='3'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="dicOID">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dicName">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='2'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dicDictionary">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='4'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              <xsl:variable name="dicVersion">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='5'">
                    <xsl:value-of select="y:Data"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>

              <xsl:variable name="newTableID">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="position()='1' and y:Data!=''">
                    <xsl:value-of select="@tableid"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>
              
              <xsl:variable name="doctypexpath">
                <xsl:for-each select="y:Cell">
                  <xsl:if test="@ename='DataType_BGCopy'">
                    <xsl:value-of select="@xpath"/>
                  </xsl:if>
                </xsl:for-each>
              </xsl:variable>


              <xsl:for-each select="y:Cell">
                <xsl:if test="(contains(@stylename,'NonProtectable') and (@id) and (@id !='') and (contains(@ename,'_BGCopy')))">


                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='OID_BGCopy'">
                        <xsl:value-of select="$dicOID"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:choose>
                          <xsl:when test="@ename='Name_BGCopy'">
                            <xsl:value-of select="$dicName"/>
                          </xsl:when>
                          <xsl:otherwise>
                            <xsl:choose>
                              <xsl:when test="@ename='DataType_BGCopy'">
                                <xsl:value-of select="$dicDataType"/>
                              </xsl:when>
                              <xsl:otherwise>
                                <xsl:choose>
                                  <xsl:when test="@ename='Dictionary_BGCopy'">
                                    <xsl:value-of select="$dicDictionary"/>
                                  </xsl:when>
                                  <xsl:otherwise>
                                    <xsl:choose>
                                      <xsl:when test="@ename='Version_BGCopy'">
                                        <xsl:value-of select="$dicVersion"/>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <xsl:value-of select="y:Data"/>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </xsl:otherwise>
                                </xsl:choose>
                              </xsl:otherwise>
                            </xsl:choose>
                          </xsl:otherwise>
                        </xsl:choose>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DataType_BGCopy'">
                        <xsl:value-of select="'DataType'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="substring-before(@ename,'_')"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="isattribute">
                    <xsl:choose>
                      <xsl:when test="@nodename='ExternalCodeList'">
                        <xsl:value-of select="'False'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="'True'"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="@tableid"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="@nodename"/>
                    <xsl:with-param name="Xpath" select="@xpath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>

                <xsl:if test="((not(@id)) and (y:Data!='') and((@tableid!='') or contains(@ename,'DDL')))">
                  <xsl:variable name="cellData">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select="$dicDataType"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="y:Data"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="elementName">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select="'DataType'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="substring-before(@ename,'_')"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <xsl:variable name="TableID">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select="$newTableID"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="@tableid"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name="NodeName">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select="'CodeList'"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="@nodename"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name ="XPath">
                    <xsl:choose>
                      <xsl:when test="@ename='DataTypeDDL'">
                        <xsl:value-of select ="$doctypexpath"/>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select ="@xpath"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>


                  <xsl:call-template name="ImportExcelGenration">
                    <xsl:with-param name="TableID" select="$TableID"/>
                    <xsl:with-param name="ElementID" select="@id"/>
                    <xsl:with-param name="IsAttribute" select="'True'"/>
                    <xsl:with-param name="AttributeName" select="$elementName"/>
                    <xsl:with-param name="AttributeValue" select="$cellData"/>
                    <xsl:with-param name="NodeName" select="$NodeName"/>
                    <xsl:with-param name="Xpath" select="$XPath"/>
                  </xsl:call-template>
                  <xsl:text/>
                </xsl:if>
              </xsl:for-each>
            </xsl:for-each>
          </xsl:when>

          <xsl:otherwise>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
    </importexceldata>
  </xsl:template>


  <xsl:template name="ImportExcelGenration">
    <xsl:param name="TableID"/>
    <xsl:param name="ElementID"/>
    <xsl:param name="IsAttribute"/>
    <xsl:param name="AttributeName"/>
    <xsl:param name="AttributeValue"/>
    <xsl:param name="NodeName"/>
    <xsl:param name="Xpath"/>

    <xsl:element name="ImportExcel">

      <xsl:attribute name="TableID">
        <xsl:value-of select="normalize-space($TableID)"/>
      </xsl:attribute>

      <xsl:attribute name="ElementID">
        <xsl:value-of select="normalize-space($ElementID)"/>
      </xsl:attribute>

      <xsl:attribute name="IsAttribute">
        <xsl:value-of select="normalize-space($IsAttribute)"/>
      </xsl:attribute>

      <xsl:attribute name="AttributeName">
        <xsl:value-of select="normalize-space($AttributeName)"/>
      </xsl:attribute>

      <xsl:attribute name="AttributeValue">
        <xsl:value-of select="normalize-space($AttributeValue)"/>
      </xsl:attribute>

      <xsl:attribute name="NodeName">
        <xsl:value-of select="$NodeName"/>
      </xsl:attribute>

      <xsl:attribute name="Xpath">
        <xsl:value-of select="normalize-space($Xpath)"/>
      </xsl:attribute>
    </xsl:element>
    <xsl:text/>
  </xsl:template>
</xsl:stylesheet>