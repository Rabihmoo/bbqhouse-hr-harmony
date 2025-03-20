
import { 
  Users, 
  UserCheck, 
  Clock, 
  Calendar,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateDashboardStats } from "@/lib/data";

const StatsCards = () => {
  const stats = calculateDashboardStats();

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-green-500",
    },
    {
      title: "On Leave",
      value: stats.onLeaveEmployees,
      icon: <Clock className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      title: "Leave Requests",
      value: stats.pendingLeaveRequests,
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      title: "Departments",
      value: stats.totalDepartments,
      icon: <Building className="h-5 w-5" />,
      color: "bg-bbqred",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div 
          key={card.title}
          className={cn(
            "bg-white dark:bg-black/40 glass rounded-xl shadow-sm overflow-hidden card-hover",
            "animate-slideUp",
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="text-3xl font-bold mt-1">
                {card.value}
              </p>
            </div>
            <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center text-white", card.color)}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
