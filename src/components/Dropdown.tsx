import ReactSelect from "react-select"

interface DropdownProps {
    value: unknown,
    onChange?: (parms: any) => void,
    options: any[],
    isMultiple: boolean,
}

export const Dropdown = ({ value, onChange, options, isMultiple = false }: DropdownProps) => {


    return (
        <ReactSelect styles={{
            indicatorSeparator: () => ({ display: "none" }),
            container: (base) => ({
                ...base,
                width: "100%",
            }),
            multiValue: (base) => ({
                ...base,
                color: "#FFFF",
                background: "#22543D",
            }),
            multiValueLabel: (base) => ({
                ...base,
                color: "#FFFF",
            })
        }}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                    ...theme.colors,
                    primary: "#48BB78"
                }
            })}
            value={value} onChange={onChange} options={options} isMulti={isMultiple}  />
    )
}
