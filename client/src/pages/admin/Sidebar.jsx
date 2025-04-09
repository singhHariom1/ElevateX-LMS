import { ChartNoAxesColumn, SquareLibrary, Menu } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

const Sidebar = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
              variant="outline"
            >
              <Menu className="text-blue-600 dark:text-blue-400" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col animate-slide-up">
            <SheetHeader className="flex flex-row items-center justify-between mt-2">
              <SheetTitle className="text-blue-600 dark:text-blue-400">
                Admin Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-8">
              <SheetClose asChild>
                <Link
                  to="dashboard"
                  className="flex items-center gap-2 p-2 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <ChartNoAxesColumn size={22} />
                  <span>Dashboard</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="course"
                  className="flex items-center gap-2 p-2 text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <SquareLibrary size={22} />
                  <span>Courses</span>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <Link
            to="dashboard"
            className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400"
          >
            <ChartNoAxesColumn size={22} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="course"
            className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400"
          >
            <SquareLibrary size={22} />
            <span className="font-medium">Courses</span>
          </Link>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
