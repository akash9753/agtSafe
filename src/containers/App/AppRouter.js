import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import asyncComponent from '../../helpers/AsyncFunc';

const PermittedRoute = ({ component: Component, permissionValue, ...rest }) =>
    <Route
        exact
        {...rest}
        render={props =>
            permissionValue !== 0
                ? <Component {...props} />
                : <Redirect
                    to={{
                        pathname: '/trans',
                        state: { from: props.location }
                    }}
                />}
    />;


class AppRouter extends React.Component {

    checkPermission = (permissions, keys) => {
        var returnObj = {
            status: 0,
            permissionObj: {}
        }
        var permissionObject = permissions;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (typeof permissionObject[key] != "undefined" && permissionObject[key] != null) {
                permissionObject = permissionObject[key];
            } else {
                return returnObj;
            }
        }
        if (typeof permissionObject["self"] != "undefined" && permissionObject["self"] != null && permissionObject["self"] !== 0) {
            returnObj.permissionObj = permissionObject;
            returnObj.status = 1;
            return returnObj;
        } else {
            return returnObj;
        }
    }

    getRoutes = (permissions) => {
        var permittedRoutes = [];
        var dashBoard = this.checkPermission(permissions, ["Project", "Study"]); 
        permittedRoutes.push({
            exact: true,
            path: '',
            component: asyncComponent(() => import('../Dashboard/dashMain'), dashBoard.permissionObj)
        });

        var treeviewPermission = this.checkPermission(permissions, ["Project", "Study", "StudyWorkSpace"]);
        if (treeviewPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'treeview',
                component: asyncComponent(() => import('../TreeView'), treeviewPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'mapping',
                component: asyncComponent(() => import('../Mapper/mapIndex'), treeviewPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'annotation',
                component: asyncComponent(() => import('../TreeView/Annotation'), treeviewPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'metadataAnnotation',
                component: asyncComponent(() => import('../MetadataAnnotation'), treeviewPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'program',
                component: asyncComponent(() => import('../Program/index'), treeviewPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'define',
                component: asyncComponent(() => import('../DefineOptimize'), treeviewPermission.permissionObj)
            });
        }

        var projectPermission = this.checkPermission(permissions, ["Project"]);
        if (projectPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'project',
                component: asyncComponent(() => import('../Project'), projectPermission.permissionObj)
            });
        }

        var standardPermission = this.checkPermission(permissions, ["Standards"]);
        if (standardPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'standards',
                component: asyncComponent(() => import('../Standards'), standardPermission.permissionObj)
            });
        }

        var customStandardPermission = this.checkPermission(permissions, ["Standards"]);
        if (customStandardPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'customStandards',
                component: asyncComponent(() => import('../Standards'), standardPermission.permissionObj)
            });
        }

        var userPermission = this.checkPermission(permissions, ["Users"]);
        if (userPermission.status !== 0) {
        permittedRoutes.push({
            exact: true,
            path: 'users',
            component: asyncComponent(() => import('../User'), userPermission.permissionObj)
        });
        }

        var addUserPermission = this.checkPermission(permissions, ["Users"]);
        if (addUserPermission.status !== 0) {
        permittedRoutes.push({
            exact: true,
            path: 'adduser',
            component: asyncComponent(() => import('../User/addUser'), addUserPermission.permissionObj)
        });
        }

        var editUserPermission = this.checkPermission(permissions, ["Users"]);
        if (editUserPermission.status !== 0) {
        permittedRoutes.push({
            exact: true,
            path: 'edituser',
            component: asyncComponent(() => import('../User/editUser'), editUserPermission.permissionObj)
        });
        }

        var rolesPermission = this.checkPermission(permissions, ["RolesAndPermissions"]);
        if (rolesPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'Roles',
                component: asyncComponent(() => import('../Roles'), rolesPermission.permissionObj)
            });
        }

        var addRolesPermission = this.checkPermission(permissions, ["RolesAndPermissions"]);
        if (addRolesPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addRoles',
                component: asyncComponent(() => import('../Roles/addRoles'), addRolesPermission.permissionObj)
            });
        }

        var editRolesPermission = this.checkPermission(permissions, ["RolesAndPermissions"]);
        if (editRolesPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editroles',
                component: asyncComponent(() => import('../Roles/editRoles'), editRolesPermission.permissionObj)
            });
        }

        var resetPasswordPermission = this.checkPermission(permissions, ["ChangePassword"]);
        if (resetPasswordPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'resetPassword',
                component: asyncComponent(() => import('../Page/resetPassword'), resetPasswordPermission.permissionObj)
            });
        }

        var myProfilePermission = this.checkPermission(permissions, ["MyProfile"]);
        if (myProfilePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'myprofile',
                component: asyncComponent(() => import('../UserSettings/myProfile'), myProfilePermission.permissionObj)
            });
        }


        var appConfigPermission = this.checkPermission(permissions, ["BulkMappingConfig"]);
        if (appConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'BulkMappingConfig',
                component: asyncComponent(() => import('../BulkMappingConfiguration'), appConfigPermission.permissionObj)
            });
        }


        var editAppConfigPermission = this.checkPermission(permissions, ["BulkMappingConfig"]);
        if (editAppConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editBulkMappingConfiguration',
                component: asyncComponent(() => import('../BulkMappingConfiguration/editBulkMappingConfiguration'), editAppConfigPermission.permissionObj)
            });
        }

        var addAppConfigPermission = this.checkPermission(permissions, ["BulkMappingConfig"]);
        if (addAppConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addBulkMappingConfiguration',
                component: asyncComponent(() => import('../BulkMappingConfiguration/addBulkMappingConfiguration'), addAppConfigPermission.permissionObj)
            });
        }

        var updatedirectconfigurationPermission = this.checkPermission(permissions, ["BulkMappingConfig"]);
        if (updatedirectconfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'importBulkMappingConfiguration',
                component: asyncComponent(() => import('../BulkMappingConfiguration/importBulkMappingConfiguration'), updatedirectconfigurationPermission.permissionObj)
            });
        }


        var appConfigPermission = this.checkPermission(permissions, ["AppConfiguration"]);
        if (appConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'AppConfiguration',
                component: asyncComponent(() => import('../AppConfiguration'), appConfigPermission.permissionObj)
            });
        }

        var editAppConfigPermission = this.checkPermission(permissions, ["AppConfiguration"]);
        if (editAppConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editAppConfiguration',
                component: asyncComponent(() => import('../AppConfiguration/editAppConfiguration'), editAppConfigPermission.permissionObj)
            });
        }

        var addAppConfigPermission = this.checkPermission(permissions, ["AppConfiguration"]);
        if (addAppConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addAppConfiguration',
                component: asyncComponent(() => import('../AppConfiguration/addAppConfiguration'), addAppConfigPermission.permissionObj)
            });
        }

        var formPermission = this.checkPermission(permissions, ["Form"]);
        if (formPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'Form',
                component: asyncComponent(() => import('../Form'), formPermission.permissionObj)
            });
        }

        var editFormPermission = this.checkPermission(permissions, ["Form"]);
        if (editFormPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editForm',
                component: asyncComponent(() => import('../Form/editForm'), editFormPermission.permissionObj)
            });
        }

        var addFormPermission = this.checkPermission(permissions, ["Form"]);
        if (addFormPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addForm',
                component: asyncComponent(() => import('../Form/addForm'), addFormPermission.permissionObj)
            });
        }

        var formActionPermission = this.checkPermission(permissions, ["Form"]);
        if (formActionPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'FormAction',
                component: asyncComponent(() => import('../FormAction'), formActionPermission.permissionObj)
            });
        }

        var passwordPermission = this.checkPermission(permissions, ["PasswordSecurityQuestion"]);
        if (passwordPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'PasswordSecurityQuestion',
                component: asyncComponent(() => import('../PasswordSecurityQuestion'), passwordPermission.permissionObj)
            });
        }

        var editPasswordSecurityQuestionPermission = this.checkPermission(permissions, ["PasswordSecurityQuestion"]);
        if (editPasswordSecurityQuestionPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editPasswordSecurityQuestion',
                component: asyncComponent(() => import('../PasswordSecurityQuestion/editPasswordSecurityQuestion'), editPasswordSecurityQuestionPermission.permissionObj)
            });
        }

        var addPasswordSecurityQuestionPermission = this.checkPermission(permissions, ["PasswordSecurityQuestion"]);
        if (addPasswordSecurityQuestionPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addPasswordSecurityQuestion',
                component: asyncComponent(() => import('../PasswordSecurityQuestion/addPasswordSecurityQuestion'), addPasswordSecurityQuestionPermission.permissionObj)
            });
        }

        var uiElementsPermission = this.checkPermission(permissions, ["UIElements"]);
        if (uiElementsPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'UIElements',
                component: asyncComponent(() => import('../UIElements'), uiElementsPermission.permissionObj)
            });
        }

        var regexPermission = this.checkPermission(permissions, ["RegularExpression"]);
        if (regexPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'RegularExpression',
                component: asyncComponent(() => import('../RegularExpression'), regexPermission.permissionObj)
            });
        }

        var addRegexPermission = this.checkPermission(permissions, ["RegularExpression"]);
        if (addRegexPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addRegularExpression',
                component: asyncComponent(() => import('../RegularExpression/addRegularExpression'), addRegexPermission.permissionObj)
            });
        }

        var editRegexPermission = this.checkPermission(permissions, ["RegularExpression"]);
        if (editRegexPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editRegularExpression',
                component: asyncComponent(() => import('../RegularExpression/editRegularExpression'), editRegexPermission.permissionObj)
            });
        }

        var wizardPermission = this.checkPermission(permissions, ["Form"]);
        if (wizardPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'Wizard',
                component: asyncComponent(() => import('../Wizard'), wizardPermission.permissionObj)
            });
        }

        var editWizardPermission = this.checkPermission(permissions, ["Form"]);
        if (editWizardPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editWizard',
                component: asyncComponent(() => import('../Wizard/editWizard'), editWizardPermission.permissionObj)
            });
        }

        var addWizardPermission = this.checkPermission(permissions, ["Form"]);
        if (addWizardPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addWizard',
                component: asyncComponent(() => import('../Wizard/addWizard'), addWizardPermission.permissionObj)
            });
        }

        var formFieldAttributePermission = this.checkPermission(permissions, ["Form"]);
        if (formFieldAttributePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'FormFieldAttribute',
                component: asyncComponent(() => import('../FormFieldAttribute'), formFieldAttributePermission.permissionObj)
            });
        }

        var editFormFieldAttributePermission = this.checkPermission(permissions, ["Form"]);
        if (editFormFieldAttributePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editFormFieldAttribute',
                component: asyncComponent(() => import('../FormFieldAttribute/editFormFieldAttribute'), editFormFieldAttributePermission.permissionObj)
            });
        }

        var addFormFieldAttributePermission = this.checkPermission(permissions, ["Form"]);
        if (addFormFieldAttributePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addFormFieldAttribute',
                component: asyncComponent(() => import('../FormFieldAttribute/addFormFieldAttribute'), addFormFieldAttributePermission.permissionObj)
            });
        }

        var DropDownFieldConfigPermission = this.checkPermission(permissions, ["Form"]);
        if (DropDownFieldConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'DropDownFieldConfig',
                component: asyncComponent(() => import('../DropDownFieldConfig'), DropDownFieldConfigPermission.permissionObj)
            });
        }

        var editDropDownFieldConfigPermission = this.checkPermission(permissions, ["Form"]);
        if (editDropDownFieldConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editDropDownFieldConfig',
                component: asyncComponent(() => import('../DropDownFieldConfig/editDropDownFieldConfig'), editDropDownFieldConfigPermission.permissionObj)
            });
        }

        var addDropDownFieldConfigPermission = this.checkPermission(permissions, ["Form"]);
        if (addDropDownFieldConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addDropDownFieldConfig',
                component: asyncComponent(() => import('../DropDownFieldConfig/addDropDownFieldConfig'), addDropDownFieldConfigPermission.permissionObj)
            });

        }

        var StandardValueLevelConfigPermission = this.checkPermission(permissions, ["StandardValueLevelConfiguration"]);
        if (StandardValueLevelConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'StandardValueLevelConfiguration',
                component: asyncComponent(() => import('../StandardValueLevelConfiguration'), StandardValueLevelConfigPermission.permissionObj)
            });
        }

        var addStandardValueLevelConfigPermission = this.checkPermission(permissions, ["StandardValueLevelConfiguration"]);
        if (addStandardValueLevelConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addStandardValueLevelConfiguration',
                component: asyncComponent(() => import('../StandardValueLevelConfiguration/addStandardValueLevelConfiguration'), addStandardValueLevelConfigPermission.permissionObj)
            });
        }

        var editStandardValueLevelConfigPermission = this.checkPermission(permissions, ["StandardValueLevelConfiguration"]);
        if (editStandardValueLevelConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editStandardValueLevelConfiguration',
                component: asyncComponent(() => import('../StandardValueLevelConfiguration/editStandardValueLevelConfiguration'), editStandardValueLevelConfigPermission.permissionObj)
            });
        }

        var StandardConfigurationPermission = this.checkPermission(permissions, ["StandardConfiguration"]);
        if (StandardConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'StandardConfiguration',
                component: asyncComponent(() => import('../StandardConfiguration'), StandardConfigurationPermission.permissionObj)
            });
        }

        var addStandardConfigurationPermission = this.checkPermission(permissions, ["StandardConfiguration"]);
        if (addStandardConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addStandardConfiguration',
                component: asyncComponent(() => import('../StandardConfiguration/addStandardConfiguration'), addStandardConfigurationPermission.permissionObj)
            });
        }

        var editStandardConfigurationPermission = this.checkPermission(permissions, ["StandardConfiguration"]);
        if (editStandardConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editStandardConfiguration',
                component: asyncComponent(() => import('../StandardConfiguration/editStandardConfiguration'), editStandardConfigurationPermission.permissionObj)
            });
        }

        var XsltConfigurationFilesPermission = this.checkPermission(permissions, ["XsltConfigurationFiles"]);
        if (XsltConfigurationFilesPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'XsltConfigurationFiles',
                component: asyncComponent(() => import('../XsltConfigurationFiles'), XsltConfigurationFilesPermission.permissionObj)
            });
        }

        var programTemplatePermission = this.checkPermission(permissions, ["ProgramTemplate"]);
        if (programTemplatePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ProgramTemplate',
                component: asyncComponent(() => import('../ProgramTemplate'), programTemplatePermission.permissionObj)
            });
        }

        var productControlledTermPermission = this.checkPermission(permissions, ["ProductControlledTerm"]);
        if (productControlledTermPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ProductControlledTerm',
                component: asyncComponent(() => import('../ProductControlledTerm'), productControlledTermPermission.permissionObj)
            });
        }

        var addProductControlledTermPermission = this.checkPermission(permissions, ["ProductControlledTerm"]);
        if (addProductControlledTermPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'AddProductControlledTerm',
                component: asyncComponent(() => import('../ProductControlledTerm/addProductControlledTerm'), addProductControlledTermPermission.permissionObj)
            });
        }

        var editProductControlledTermPermission = this.checkPermission(permissions, ["ProductControlledTerm"]);
        if (editProductControlledTermPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'EditProductControlledTerm',
                component: asyncComponent(() => import('../ProductControlledTerm/editProductControlledTerm'), editProductControlledTermPermission.permissionObj)
            });
        }

        var ListPermission = this.checkPermission(permissions, ["Form"]);
        if (ListPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ListPageConfiguration',
                component: asyncComponent(() => import('../ListPageConfiguration'), ListPermission.permissionObj)
            });
        }

        var macroPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (macroPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'MacroTemplate',
                component: asyncComponent(() => import('../MacroTemplate'), macroPermission.permissionObj)
            });
        }

        var addMacroPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (addMacroPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ModifyMacroTemplate',
                component: asyncComponent(() => import('../MacroTemplate/addMacroTemplate'), addMacroPermission.permissionObj)
            });
        }

        var dataSetValidationRulePermission = this.checkPermission(permissions, ["DatasetValidationRule"]);
        if (dataSetValidationRulePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'DataSetValidationRule',
                component: asyncComponent(() => import('../DataSetValidationRule'), dataSetValidationRulePermission.permissionObj)
            });
        }

        var adddataSetValidationRulePermission = this.checkPermission(permissions, ["DatasetValidationRule"]);
        if (adddataSetValidationRulePermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'CreateDataSetValidationRule',
                component: asyncComponent(() => import('../DataSetValidationRule/createDataSetValidationRule'), adddataSetValidationRulePermission.permissionObj)
            });
        }

        var defineFormConfigurationPermission = this.checkPermission(permissions, ["DefineFormConfiguration"]);
        if (defineFormConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'DefineFormConfiguration',
                component: asyncComponent(() => import('../DefineFormConfiguration'), defineFormConfigurationPermission.permissionObj)
            });
        }

        var addDefineFormConfigurationPermission = this.checkPermission(permissions, ["DefineFormConfiguration"]);
        if (addDefineFormConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'addDefineFormConfiguration',
                component: asyncComponent(() => import('../DefineFormConfiguration/addDefineFormConfiguration'), addDefineFormConfigurationPermission.permissionObj)
            });
        }

        var editDefineFormConfigurationPermission = this.checkPermission(permissions, ["DefineFormConfiguration"]);
        if (editDefineFormConfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'editDefineFormConfiguration',
                component: asyncComponent(() => import('../DefineFormConfiguration/editDefineFormConfiguration'), editDefineFormConfigurationPermission.permissionObj)
            });
        }

        var pyPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (pyPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'PyTemplate',
                component: asyncComponent(() => import('../PyTemplate'), pyPermission.permissionObj)
            });
        }
        var addPyPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (addPyPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ModifyPyTemplate',
                component: asyncComponent(() => import('../PyTemplate/addPyTemplate'), addPyPermission.permissionObj)
            });
        }
        var mappingBlockPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (mappingBlockPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'MappingBlock',
                component: asyncComponent(() => import('../MappingBlock'), mappingBlockPermission.permissionObj)
            });
        }
        var addmappingBlockPermission = this.checkPermission(permissions, ["MacroTemplate"]);
        if (addmappingBlockPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ModifyMappingBlock',
                component: asyncComponent(() => import('../MappingBlock/addMappingBlock'), mappingBlockPermission.permissionObj)
            });
        }
        var viewImport = true;
        if (viewImport) {
            permittedRoutes.push({
                exact: true,
                path: 'ViewImport',
                component: asyncComponent(() => import('../DefineBot/DefineStudy/ViewImport'), {})
            });
        }
        var mailConfigPermission = this.checkPermission(permissions, ["AppConfiguration"]);
        if (mailConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'EmailTemplate',
                component: asyncComponent(() => import('../Mail'), appConfigPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'addEmailTemplate',
                component: asyncComponent(() => import('../Mail/composeMail'), appConfigPermission.permissionObj)
            });
            permittedRoutes.push({
                exact: true,
                path: 'editEmailTemplate',
                component: asyncComponent(() => import('../Mail/updateComposeMail'), appConfigPermission.permissionObj)
            });
        }

        
        var unitConfigPermission = this.checkPermission(permissions, ["UnitConfiguration"]);
        if (unitConfigPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'UnitConfiguration',
                component: asyncComponent(() => import('../UnitConfiguration'), unitConfigPermission.permissionObj)
            });
        }

        var addunitconfigurationPermission = this.checkPermission(permissions, ["UnitConfiguration"]);
        if (addunitconfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'AddUnitConfiguration',
                component: asyncComponent(() => import('../UnitConfiguration/addUnitConfiguration'), addunitconfigurationPermission.permissionObj)
            });
        }
        var updateunitconfigurationPermission = this.checkPermission(permissions, ["UnitConfiguration"]);
        if (updateunitconfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'EditUnitConfiguration',
                component: asyncComponent(() => import('../UnitConfiguration/editUnitConfiguration'), updateunitconfigurationPermission.permissionObj)
            });
        }
        var importunitconfigurationPermission = this.checkPermission(permissions, ["UnitConfiguration"]);
        if (importunitconfigurationPermission.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'ImportConfiguration',
                component: asyncComponent(() => import('../UnitConfiguration/importConfiguration'), importunitconfigurationPermission.permissionObj)
            });
        }

        //var mappingLibPermission = this.checkPermission(permissions, ["MappingLibrary"]);
        //if (mappingLibPermission.status !== 0) {
        //    permittedRoutes.push({
        //        exact: true,
        //        path: 'mappinglibrary',
        //        component: asyncComponent(() => import('../MappingLibrary/mappinglibrarylist'), mappingLibPermission.permissionObj)
        //    });
        //}

        var MappingLibrary = this.checkPermission(permissions, ["MappingLibrary"]);
        if (MappingLibrary.status !== 0) {
            permittedRoutes.push({
                exact: true,
                path: 'mappingLibrary',
                component: asyncComponent(() => import('../MappingLibrary/mappinglibrarylist'), MappingLibrary.permissionObj)
            });
        }

        return permittedRoutes;

    };

    render() {
        const { url, permissions, style } = this.props;

        const routes = this.getRoutes(permissions);

        return (
            <div className="mainContentDiv" style={{}}>
                {routes.map(singleRoute => {
                    const { path, exact, ...otherProps } = singleRoute;
                    return (
                        <Route
                            exact={exact === false ? false : true}
                            key={singleRoute.path}
                            path={`${url}/${singleRoute.path}`}
                            {...otherProps}
                        />
                    );
                })}
            </div>
        );
    }
}

export default AppRouter;
