import { useState } from 'react'
import { Schedule, BoxAction } from './components'
import { generateSchedule } from './utils/scheduleGenerator'

function App() {
    const [days, setDays] = useState(0)
    const [data, setData] = useState({
        s1: [],
        s2: [],
        s3: [],
        '#P': [],
    })
    const [errors, setErrors] = useState([])
    const [isValid, setIsValid] = useState(true)

    const handleCalculate = (formData) => {
        const { daysWorks, daysRest, daysInduction, totalDaysPerforation } = formData        
        try {
            // Generar cronograma usando el nuevo algoritmo
            const result = generateSchedule(
                Number(daysWorks),
                Number(daysRest),
                Number(daysInduction),
                Number(totalDaysPerforation)
            )
            console.log(result)
            setDays(Number(totalDaysPerforation))
            setData(result.schedule)
            setErrors(result.errors)
            setIsValid(result.isValid)
            
        } catch (error) {
            console.error('Error al generar cronograma:', error)
            alert(error.message)
        }
    }


    return (
        <main className='bg-gray-900 min-h-screen flex flex-col p-4'>
            <BoxAction handleCalculate={handleCalculate} />
            
            {/* Mostrar errores si existen */}
            {/* {errors.length > 0 && (
                <div className='bg-red-900/30 border-2 border-red-500 rounded-xl p-6 mb-6 backdrop-blur-sm'>
                    <h3 className='text-red-400 text-xl font-bold mb-4 flex items-center gap-2'>
                        <span className='text-2xl'>⚠️</span>
                        Errores Detectados ({errors.length})
                    </h3>
                    <div className='space-y-2 max-h-60 overflow-y-auto'>
                        {errors.map((error, idx) => (
                            <div key={idx} className='bg-red-950/50 p-3 rounded-lg border border-red-700'>
                                <p className='text-red-300 text-sm font-mono'>{error.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}
            
            {/* Mostrar indicador de éxito */}
            {days > 0 && isValid && (
                <div className='bg-green-900/30 border-2 border-green-500 rounded-xl p-4 mb-6 backdrop-blur-sm'>
                    <p className='text-green-400 text-lg font-bold flex items-center gap-2'>
                        <span className='text-2xl'>✓</span>
                        Cronograma válido - Cumple todas las reglas
                    </p>
                </div>
            )}
            
            <Schedule
                data={data}
                days={days}
                errors={errors}
            />
        </main>
    )
}

export default App