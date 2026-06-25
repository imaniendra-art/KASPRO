import { CheckCircle } from "lucide-react";

export default function ThemeMinimalist(props: any) {
  const { themes, theme, setTheme } = props;

  return (
    <div className="space-y-6 ">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personalisasi Tema</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pilih tampilan antarmuka yang paling nyaman untuk Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((t: any) => {
          const isActive = theme === t.id;
          return (
            <div 
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                isActive 
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-600" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-gray-500 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-md ${isActive ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                {isActive && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">{t.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
