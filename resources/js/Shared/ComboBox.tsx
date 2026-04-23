import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

const CustomOption = (props) => (
    <components.Option {...props}>
        <div>
            <strong>{props.data.label}</strong> {/* Display the label */}
            {props.data.description && <p>{props.data.description}</p>}
        </div>
    </components.Option>
);

const ComboBox = ({ onChange, apiUrlPath, placeholder }) => {
    // console.log(options);
    const optionsExample = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    const loadOptions = async (inputValue, callback) => {
        try {
            // Fetch options from an API or any other data source
            const response = await fetch(`${apiUrlPath}?query=${inputValue}`);
            const json = await response.json();
            const options = await json.data;

            // Transform the data into the format expected by react-select
            // Call the callback with the options
            callback(options);
        } catch (error) {
            console.error("Error loading options:", error);
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            boxShadow: "none", // this will remove the box-shadow when the select (input) is focused
            "&:hover": {
                borderColor: "gray", // changes the border color when hovering
            },
            "input:focus": (provided) => ({
                ...provided,
                margin: "0px",
                outline: none,
            }),
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    return (
        <AsyncSelect
            isClearable
            cacheOptions
            defaultOptions
            onChange={onChange}
            loadOptions={loadOptions}
            components={{ Option: CustomOption }}
            placeholder={placeholder}
            styles={customStyles}
            menuPortalTarget={document.body}
        />
    );
};

export default ComboBox;
