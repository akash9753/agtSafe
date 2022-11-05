import React from 'react';
import { useState, useEffect } from 'react';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input'
import {

    checkNullorbalnk
} from '../Utility/validator';
import TelephoneInput from 'react-phone-number-input/input'
import labels from 'react-phone-number-input/locale/ru'
import { Form } from 'antd';
import { isSupportedCountry } from 'react-phone-number-input'


const FormItem = Form.Item;
export function Telephone(property) {
    let { field, SelCountry, allData, getFieldDecorator } = property;

    let [value, setValue] = useState(field.defaultValue);
    const setvalue = (value) => {

        setValue(value)
    }

    const telephoneValidation = () => {
        if (value) {
            let { form } = allData.props;
            //get error
            let field = form.getFieldInstance("Telephone");
            let error = field.getAttribute("error");
            if (error) {
                allData.props.form.setFields({
                    Telephone: {
                        value: value,
                        errors: [new Error(error)],
                    },
                });
            } else {
                form.setFields({
                    Telephone: {
                        value: value,
                    },
                });
            }
        }
    }

    const validation = (rule, value, callback) => {
        if (value) {
            let { form } = allData.props;
            //get error
            let field = form.getFieldInstance("Telephone");
            let error = field.getAttribute("error");
            if (error) {
                callback('');
            } else {
                callback();
                return;
            }
        } else {
            callback();
            return;
        }
    }
    //when keyup
    useEffect(() => {
        if (field.editable) {
            telephoneValidation();
        }
    }, [value])



    return <FormItem
        label={field.displayName}
    >
        {
            getFieldDecorator(field.attributeName, {
                onKeyDown: setvalue,
                rules: [{
                        regExPattern: "/^(?!.*  )[A-Za-z0-9 ]+$/",
                    validator: validation, message: "Enter valid number"}],
                initialValue: field.defaultValue,
                value: value,
                //validateTrigger: ['onKeyup', 'onBlur'],
                valuePropName: 'value',
            })(<TelephoneInput
                size="small"
                className={"ant-input ant-input-sm"}
                country={isSupportedCountry(SelCountry) ? SelCountry : "IN"}
                countryName={isSupportedCountry(SelCountry) ? SelCountry : "IN"}
                onChange={setValue}
                tabIndex={0}
                international
                withCountryCallingCode
                error={value ? (isValidPhoneNumber(value) ? undefined : field.inputTypeErrorMessage) : ''}
                id={field.attributeName}
                disabled={(!field.editable)}
            />)}
    </FormItem>


}


