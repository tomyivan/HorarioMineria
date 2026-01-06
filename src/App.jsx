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
            <Schedule
                data={data}
                days={days}
                errors={errors}
            />
        </main>
    )
}

export default App