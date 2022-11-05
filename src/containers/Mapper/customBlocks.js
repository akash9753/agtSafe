
import * as Blockly from 'blockly/core';




var eq_type = {
    "type": "eq_type",
    "message0": "%1 %2 %3 %4",
    "args0": [
        {
            "type": "input_statement",
            "name": "left_values"
        },
        {
            "type": "field_dropdown",
            "name": "operator_name",
            "options": [
                [
                    "EQ",
                    "EQ"
                ],
                [
                    "NEQ",
                    "NEQ"
                ],
                [
                    "LT",
                    "LT"
                ],
                [
                    "LEQ",
                    "LEQ"
                ],
                [
                    "GT",
                    "GT"
                ],
                [
                    "GEQ",
                    "GEQ"
                ]
            ]
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "right_values"
        }
    ],
    "previousStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['eq_type'] = {
    init: function () {
        this.jsonInit(eq_type);
    }
};

var eq_type_single = {
    "type": "eq_type_single",
    "message0": "%1 %2 %3 %4",
    "args0": [
        {
            "type": "input_value",
            "name": "left_value"
        },
        {
            "type": "field_dropdown",
            "name": "operator_name",
            "options": [
                [
                    "EQ",
                    "EQ"
                ],
                [
                    "NEQ",
                    "NEQ"
                ],
                [
                    "LT",
                    "LT"
                ],
                [
                    "LEQ",
                    "LEQ"
                ],
                [
                    "GT",
                    "GT"
                ],
                [
                    "GEQ",
                    "GEQ"
                ]
            ]
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_value",
            "name": "right_value"
        }
    ],
    "previousStatement": null,
    "colour": 230,
    "inputsInline": true,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['eq_type_single'] = {
    init: function () {
        this.jsonInit(eq_type_single);
    }
};

var andor_type = {
    "type": "andor_type",
    "message0": "%1 %2 %3 %4",
    "args0": [
        {
            "type": "input_statement",
            "name": "left_value"
        },
        {
            "type": "field_dropdown",
            "name": "operator",
            "options": [
                [
                    "AND",
                    "AND"
                ],
                [
                    "OR",
                    "OR"
                ],
            ]
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "right_value"
        }
    ],
    "previousStatement": null,
    "colour": 230,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['andor_type'] = {
    init: function () {
        this.jsonInit(andor_type);
    }
};


var simple_ops_mutiple_args_type = {
    "type": "simple_ops_mutiple_args_type",
    "message0": "%1 %2 %3",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "op_name",
            "options": [
                [
                    "CONCATENATE",
                    "CONCATENATE"
                ],
                [
                    "UPPER CASE",
                    "UPPER CASE"
                ],
                [
                    "LOWER CASE",
                    "LOWER CASE"
                ],
                [
                    "PROP CASE",
                    "PROP CASE"
                ]
            ]
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "op_values"
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "colour": 150,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['simple_ops_mutiple_args_type'] = {
    init: function () {
        this.jsonInit(simple_ops_mutiple_args_type);
    }
};


var simple_ops_single_arg_type = {
    "type": "simple_ops_single_arg_type",
    "message0": "%1 %2 %3",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "op_name",
            "options": [
                [
                    "HARDCODE",
                    "HARDCODE"
                ],
                [
                    "DIRECT MOVE",
                    "DIRECT MOVE"
                ],
                [
                    "UPPER CASE",
                    "UPPER CASE"
                ],
                [
                    "LOWER CASE",
                    "LOWER CASE"
                ],
                [
                    "PROP CASE",
                    "PROP CASE"
                ]
            ]
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_value",
            "name": "op_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 150,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['simple_ops_single_arg_type'] = {
    init: function () {
        this.jsonInit(simple_ops_single_arg_type);
    }
};

var dataset_type_multi_source = {
    "type": "dataset_type_multi_source",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "ds_name",
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "colour": 20,
    "helpUrl": ""
};
Blockly.Blocks['dataset_type_multi_source'] = {
    init: function () {
        this.jsonInit(dataset_type_multi_source);
        
    }
};
var dataset_type_single_source = {
    "type": "dataset_type_single_source",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "ds_name",
        }
    ],
    "inputsInline": false,
    "output": null,
    "tooltip": "",
    "colour": 20,
    "helpUrl": ""
};

Blockly.Blocks['dataset_type_single_source'] = {
    init: function () {
        this.jsonInit(dataset_type_single_source);
    }
};

var dataset_type_multi_target = {
    "type": "dataset_type_multi_target",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "ds_name",
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "colour": 250,
    "helpUrl": ""
};
Blockly.Blocks['dataset_type_multi_target'] = {
    init: function () {
        this.jsonInit(dataset_type_multi_target);

    }
};
var dataset_type_single_target = {
    "type": "dataset_type_single_target",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "ds_name",
        }
    ],
    "inputsInline": false,
    "output": null,
    "tooltip": "",
    "colour": 250,
    "helpUrl": ""
};

Blockly.Blocks['dataset_type_single_target'] = {
    init: function () {
        this.jsonInit(dataset_type_single_target);
    }
};
var variable_type_source_multi = {
    "type": "variable_type_source_multi",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "var_name",
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "colour": 65,
    "helpUrl": ""
};
Blockly.Blocks['variable_type_source_multi'] = {
    init: function () {
        this.jsonInit(variable_type_source_multi);
    }
};


var variable_type_source_single = {
    "type": "variable_type_source_single",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "var_name",
        }
    ],
    "inputsInline": false,
    "output": null,
    "tooltip": "",
    "colour": 65,
    "helpUrl": ""
};
Blockly.Blocks['variable_type_source_single'] = {
    init: function () {
        this.jsonInit(variable_type_source_single);
    }
};


var variable_type_target_multi = {
    "type": "variable_type_target_multi",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "var_name",
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "",
    "colour": "300",
    "helpUrl": ""
};
Blockly.Blocks['variable_type_target_multi'] = {
    init: function () {
        this.jsonInit(variable_type_target_multi);
    }
};


var variable_type_target_single = {
    "type": "variable_type_target_single",
    "message0": "%1",
    "args0": [
        {
            "type": "field_label_serializable",
            "name": "var_name",
        }
    ],
    "inputsInline": false,
    "output": null,
    "tooltip": "",
    "colour": "300",
    "helpUrl": ""
};
Blockly.Blocks['variable_type_target_single'] = {
    init: function () {
        this.jsonInit(variable_type_target_single);
    }
};
var if_else_type = {
    "type": "if_else_type",
    "message0": "IF %1 %2 DO %3 %4 ELSE %5 %6",
    "args0": [
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "if_value"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "do_value"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "else_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['if_else_type'] = {
    init: function () {
        this.jsonInit(if_else_type);
    }
};

var filter = {
    "type": "filter_type",
    "message0": "FILTER %1 %2 CONDITION %3 %4",
    "args0": [
        {
            "type": "input_value",
            "name": "filter_value"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "filter_condition"
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['filter_type'] = {
    init: function () {
        this.jsonInit(filter);
    }
};

var int_constant_type_multi = {
    "type": "int_constant_type_multi",
    "message0": "%1",
    "args0": [
        {
            "type": "field_input",
            "name": "int_constant",
            "text": ""
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['int_constant_type_multi'] = {
    init: function () {
        this.jsonInit(int_constant_type_multi);
    }
};

var int_constant_type_single = {
    "type": "int_constant_type_single",
    "message0": "%1",
    "args0": [
        {
            "type": "field_input",
            "name": "int_constant",
            "text": ""
        }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['int_constant_type_single'] = {
    init: function () {
        this.jsonInit(int_constant_type_single);
    }
};

var const_type_multi = {
    "type": "const_type_multi",
    "message0": "\" %1 \"",
    "args0": [
        {
            "type": "field_input",
            "name": "const_str",
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 55,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['const_type_multi'] = {
    init: function () {
        this.jsonInit(const_type_multi);
    }
};

var for_type = {
    "type": "for_type",
    "message0": "FOR EACH %1 DO %2",
    "args0": [
        {
            "type": "input_statement",
            "name": "for_value"
        },
        {
            "type": "input_statement",
            "name": "do_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 85,
    "tooltip": "",
    "helpUrl": ""
};
Blockly.Blocks['for_type'] = {
    init: function () {
        this.jsonInit(for_type);
    }
};


var select_type = {
    "type": "select_type",
    "message0": "SELECT %1 %2 VARIABLES %3 %4",
    "args0": [
        {
            "type": "input_value",
            "name": "select_value"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_dummy"
        },
        {
            "type": "input_statement",
            "name": "select_variables"
        }
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['select_type'] = {
    init: function () {
        this.jsonInit(select_type);
    }
};

var where_type = {
    "type": "where_type",
    "message0": "WHERE %1",
    "args0": [
        {
            "type": "input_statement",
            "name": "where_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 100,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['where_type'] = {
    init: function () {
        this.jsonInit(where_type);
    }
};

var group_type = {
    "type": "group_type",
    "message0": "GROUP BY %1",
    "args0": [
        {
            "type": "input_statement",
            "name": "group_by_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 100,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['group_type'] = {
    init: function () {
        this.jsonInit(group_type);
    }
};

var condition_type = {
    "type": "condition_type",
    "message0": "Condition %1 THEN %2",
    "args0": [
        {
            "type": "input_statement",
            "name": "condition_value"
        },
        {
            "type": "field_input",
            "name": "then_value",
            "text": ""
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['condition_type'] = {
    init: function () {
        this.jsonInit(condition_type);
    }
};

var map_type = {
    "type": "map_type",
    "message0": "MAP %1 Conditions %2",
    "args0": [
        {
            "type": "input_statement",
            "name": "map_value"
        },
        {
            "type": "input_statement",
            "name": "map_conditions"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};


Blockly.Blocks['map_type'] = {
    init: function () {
        this.jsonInit(map_type);
    }
};

var bulkmap_type = {
    "type": "bulkmap_type",
    "message0": "BulkMap % 1 ConfigVariable % 2 Cond.Override % 3",
    "args0": [
        {
            "type": "input_statement",
            "name": "map_value"
        },
        {
            "type": "input_statement",
            "name": "config_variable"
        },
        {
            "type": "input_statement",
            "name": "conditions"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};


Blockly.Blocks['bulkmap_type'] = {
    init: function () {
        this.jsonInit(bulkmap_type);
    }
};


var out_ds_type = {
    "type": "out_ds_type",
    "message0": "OUT DATASET %1",
    "args0": [
        {
            "type": "input_statement",
            "name": "out_ds"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 100,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['out_ds_type'] = {
    init: function () {
        this.jsonInit(out_ds_type);
    }
};

var out_vr_type = {
    "type": "out_vr_type",
    "message0": "OUT VARIABLE %1",
    "args0": [
        {
            "type": "input_statement",
            "name": "out_variable"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 100,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['out_vr_type'] = {
    init: function () {
        this.jsonInit(out_vr_type);
    }
};


var merge_type = {
    "type": "merge_type",
    "message0": "MERGE %1 BY VARIABLES %2 IF CONDITION %3",
    "args0": [
        {
            "type": "input_statement",
            "name": "merge_value"
        },
        {
            "type": "input_statement",
            "name": "merge_variables"
        },
        {
            "type": "input_statement",
            "name": "if_cond_value"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 45,
    "tooltip": "",
    "helpUrl": ""
};

Blockly.Blocks['merge_type'] = {
    init: function () {
        this.jsonInit(merge_type);
    }
};
