import { Button } from "../../shared/Button"
import { Input } from "../../shared/Input"
import { X, Key, Zap } from "lucide-react"
export const BoxAction = ({
    handleCalculate
}) => {
    const captureData = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target.form)
        const newData = Object.fromEntries(formData)
        if ( validationData(newData) ) handleCalculate(newData);
    }
    const validationData = (data) => {
        for (const key in data) {
            
            if (key === "daysInduction" && Number(data[key]) > 5) {
                alert("Los dias de induccion no pueden ser mayores a 5")
                return false
            }
            if (Number(data[key]) < 0 || data[key] === "") {
                alert("Los valores no pueden ser negativos o vacios")
                return false
            }
        }
        return true
    }
    return (
        <div className="p-6 from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 mb-6">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                <Key className="text-blue-500" size={28} />
                Parámetros de Cronograma
            </h1>
            <form className="flex items-end flex-wrap md:flex-nowrap gap-4">
                {/* Régimen */}
                <div className="flex items-end gap-2 flex-1">
                    <div className="flex-1">
                        <Input
                            label={"Régimen (Trabajo x Descanso)"}
                            placeholder="Días de Trabajo"
                            type={"number"}
                            name={"daysWorks"}
                            min={1}
                            required
                        />
                    </div>
                    <div className="text-gray-400 pb-3">
                        <X size={20} />
                    </div>
                    <div className="flex-1">
                        <Input
                            placeholder="Días de Descanso"
                            type={"number"}
                            name={"daysRest"}
                            min={1}
                            required
                        />                
                    </div>
                </div>

                {/* Inducción */}
                <div className="flex-1">
                    <Input 
                        label={"Inducción"}
                        placeholder="Días de Inducción"
                        type={"number"}
                        name={"daysInduction"}
                        max={5}
                        min={0}
                        required
                    />         
                </div>

                {/* Total Días */}
                <div className="flex-1">
                    <Input 
                        label={"Total de Días"}
                        placeholder="Total días de Perforación"
                        type={"number"}
                        name={"totalDaysPerforation"}
                        min={2}
                        required
                    />         
                </div>

                {/* Botón */}
                <Button 
                    variant={'primary'}
                    onClick={captureData}
                    type={"submit"}
                    className="h-fit"
                >
                    <Zap size={18} className="mr-2 inline" />
                    Generar
                </Button>
            </form>          
        </div>
    )
}