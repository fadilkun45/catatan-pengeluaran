import ReactSelect from "react-select"
import { useToken } from "@chakra-ui/react"

interface DropdownProps {
    value: unknown,
    onChange?: (parms: any) => void,
    options: any[],
    isMultiple: boolean,
}

export const Dropdown = ({ value, onChange, options, isMultiple = false }: DropdownProps) => {
    const [chip, primary] = useToken('colors', ['green.800', 'green.400'])


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
                background: chip,
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
                    primary
                }
            })}
            value={value} onChange={onChange} options={options} isMulti={isMultiple}  />
    )
}
