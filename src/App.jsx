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
    // Recibe parámetros del formulario y genera el cronograma
    const handleCalculate = (formData) => {
        const { daysWorks, daysRest, daysInduction, totalDaysPerforation } = formData        
        try {
            const result = generateSchedule(
                Number(daysWorks),
                Number(daysRest),
                Number(daysInduction),
                Number(totalDaysPerforation)
            )
            setDays(Number(totalDaysPerforation))
            setData(result.schedule)
            
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
            />
        </main>
    )
}

export default App