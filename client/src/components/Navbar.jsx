import { Menu, Rocket, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  const handleAuthAction = (type) => {
    if (location.pathname !== "/login") {
      navigate("/login");
      // Wait for navigation to complete and component to mount
      setTimeout(() => {
        window.setAuthTab?.(type);
      }, 100);
    } else {
      window.setAuthTab?.(type);
    }
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-16 dark:bg-[#020817]/95 bg-white/95 backdrop-blur-sm border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 shadow-sm"
    >
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Rocket className="text-blue-600 dark:text-blue-400" size={"30"} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
          </div>
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ElevateX
            </h1>
          </Link>
        </motion.div>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="border-2 border-blue-500 dark:border-blue-400">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 animate-fade-in">
                <DropdownMenuLabel className="text-blue-600 dark:text-blue-400">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                    <Link to="my-learning" className="w-full">
                      My learning
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                    <Link to="profile" className="w-full">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer">
                      <Link to="/admin/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleAuthAction("login")}
                className="bg-white hover:bg-blue-50 dark:bg-transparent dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
              >
                Login
              </Button>
              <Button
                onClick={() => handleAuthAction("signup")}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-2 border-transparent"
              >
                Signup
              </Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <Rocket className="text-blue-600 dark:text-blue-400" size={"24"} />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
          </div>
          <Link to="/">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
            >
              ElevateX
            </motion.h1>
          </Link>
        </motion.div>
        <MobileNavbar user={user} handleAuthAction={handleAuthAction} />
      </div>
    </motion.div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, handleAuthAction }) => {
  const navigate = useNavigate();
  const [logoutUser, { isSuccess, data }] = useLogoutUserMutation();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
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
      <SheetContent className="flex flex-col animate-slide-up">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Rocket
                  className="text-blue-600 dark:text-blue-400"
                  size={"24"}
                />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
              </div>
              <Link
                to="/"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
              >
                ElevateX
              </Link>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          {user ? (
            <>
              <Link
                to="my-learning"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                My learning
              </Link>
              <Link
                to="profile"
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
              >
                Edit Profile
              </Link>
              {user?.role === "instructor" && (
                <Link
                  to="/admin/dashboard"
                  className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Dashboard
                </Link>
              )}
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={logoutHandler}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleAuthAction("login")}
                className="w-full bg-white hover:bg-blue-50 dark:bg-transparent dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
              >
                Login
              </Button>
              <Button
                onClick={() => handleAuthAction("signup")}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-2 border-transparent"
              >
                Signup
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
