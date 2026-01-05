import { StatesActivity } from "../states/States";
const activities = [
    { type: 'up', label: 'Subida', color:'bg-blue-500', icon: 'S' },
    { type: 'induction', label: 'Inducción', color:'bg-yellow-500', icon: 'I' },
    { type: 'perforation', label: 'Perforación', color:'bg-green-500', icon: 'P' },
    { type: 'down', label: 'Bajada', color:'bg-red-500', icon: 'B' },
    { type: 'downtime', label: 'Descanso', color:'bg-gray-500', icon: 'D' },
    { type: '-', label: 'Vacio', color:'bg-white', icon: '-' },
];
export const Activities  = () => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Leyenda de Actividades</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
                {
                    activities.map((activity) => (  
                        <div 
                            key={activity.type} 
                            className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer bg-gray-800 border border-gray-700 hover:border-gray-500"
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${activity.color}`}></div>                            
                            <div className={`text-3xl mb-2 ${activity.color} rounded-full w-12 h-12 flex items-center justify-center`}>
                                {activity.icon}
                            </div>                                                      
                            <span className="text-sm font-semibold text-gray-100 text-center group-hover:text-white transition-colors">
                                {activity.label}
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}