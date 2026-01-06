import { Button } from "../../shared/Button"
import { Input } from "../../shared/Input"
import { X, Key } from "lucide-react"
import { useState } from "react"
export const BoxAction = ({
    handleCalculate
}) => {
    const [ error, setError ] = useState( null)
    
    // Captura datos del formulario y valida antes de enviar
    const captureData = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target.form)
        const newData = Object.fromEntries(formData)
        if ( validationData(newData) ) handleCalculate(newData);
    }
    
    // Valida que los parámetros sean válidos
    const validationData = (data) => {
        const errors = {}
        for (const key in data) {            
            if ( Number(data[key]) <= 0 || data[key] === "") {
                errors[key] = "Ingrese un valor válido."
            }
            if ( key === "daysInduction" && Number(data[key]) > 5 ) {
                errors[key] = "Debe ser mayores a 5"
            }
            if ( key === "daysRest" && Number(data[key]) <= 2 ) {
                errors[key] = "Debe ser mayores a 2"
            }
            
        }
        if ( data["daysInduction"] >= data["daysWorks"] ) {
            errors["daysInduction"] = "Debe ser menor a Días de Trabajo"
        }
        if ( data["totalDaysPerforation"] < ( Number(data["daysWorks"]) + Number(data["daysRest"]) ) ) {
            errors["totalDaysPerforation"] = "Debe ser mayor o igual a la suma de Días de Trabajo y Días de Descanso"
        }
        setError( Object.keys(errors).length > 0 ? errors : null)
        return Object.keys(errors).length === 0
    }
    return (
        <div className="p-6 from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 mb-6 overflow-hidden bg-gradient-to-br">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Key className="text-blue-500" size={28} />
                Parámetros de Cronograma
            </h1>
            <form className="flex items-end flex-col  gap-4">
                {/* Régimen */}
                <div className="flex flex-col md:flex-row items-end gap-2 w-full  ">
                    <div className="flex flex-col w-full">
                        <label htmlFor="daysWorks">
                            <span className="text-sm font-semibold text-gray-300 block mb-2">Régimen (Trabajo x Descanso)</span>
                        </label>
                        <div className="flex flex-row">
                            <Input
                                placeholder="Días de Trabajo"
                                type={"number"}
                                name={"daysWorks"}
                                required
                                validation={ error?.["daysWorks"] ? { label: error["daysWorks"] } : null }
                            />
                            <X className="text-gray-400 mx-2 mt-2" size={30} />
                            <Input
                                placeholder="Días de Descanso"
                                type={"number"}
                                name={"daysRest"}
                                required
                                validation={ error?.["daysRest"] ? { label: error["daysRest"] } : null }
                            />                                
                        </div>
                    </div>
                    <Input 
                        label={"Inducción"}
                        placeholder="Días de Inducción"
                        type={"number"}
                        name={"daysInduction"}
                        required
                        validation={ error?.["daysInduction"] ? { label: error["daysInduction"] } : null }
                    />         
                    <Input 
                        label={"Total de Días"}
                        placeholder="Total días de Perforación"
                        type={"number"}
                        name={"totalDaysPerforation"}
                        required
                        validation={ error?.["totalDaysPerforation"] ? { label: error["totalDaysPerforation"] } : null }
                    />         
                </div>
                <Button 
                    variant={'primary'}
                    onClick={captureData}
                    type={"submit"}
                    className="h-fit min-w-50"
                >
                    Calcular Cronograma
                </Button>
            </form>          
        </div>
    )
}