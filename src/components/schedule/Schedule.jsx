import { Activities } from "./Activities";
import { StatesActivity } from "../states/States";
export const Schedule = ({ data, days }) => {
    console.log(data);
    return (
        <section className="text-gray-200 my-6 flex flex-col">
            <Activities />
            <div className="rounded-xl shadow-2xl overflow-hidden w-full bg-gray-800 border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className=" bg-blue-400 border-b-2 border-gray-700">
                                <th className="px-4 py-3 text-left font-bold text-white sticky left-0 bg-blue-600 z-10">Dias</th>
                                {
                                    Array.from({ length: days }, (_, i) => (
                                        <th 
                                            key={i}
                                            className=" py-3 text-center font-semibold text-white text-sm"
                                        >
                                            {i}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.entries(data)?.map(([key, value], index) => (
                                    <tr 
                                        key={index}
                                        className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-bold text-white sticky left-0 bg-gray-800 z-10 min-w-fit">
                                            {key}
                                        </td>
                                        
                                           { key !== '#P' ?  value.map((activity, idx) => (
                                                <td 
                                                    key={idx}
                                                    className="py-1 text-center"
                                                >
                                                    <StatesActivity type={activity} />
                                                </td>
                                            )) : (
                                                value.map((count, idx) => (
                                                    <td 
                                                        key={idx}
                                                        className="py-3 text-center font-semibold text-white text-sm"
                                                    >
                                                        {count}
                                                    </td>
                                                ))                                            
                                            )
                                        }
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}