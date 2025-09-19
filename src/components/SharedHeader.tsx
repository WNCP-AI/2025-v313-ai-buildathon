import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useMode } from "@/contexts/ModeContext";
import {
  LogOut,
  LayoutDashboard,
  List,
  Plus,
  Calendar,
  User,
  Plane,
  ArrowLeftRight,
  Crown,
  ChevronDown
} from "lucide-react";

const SharedHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, getUserRole } = useAuth();
  const { currentMode, switchMode } = useMode();

  const operatorMenuItems = [
    { title: "Dashboard", url: "/operator-dashboard", icon: LayoutDashboard },
    { title: "My Listings", url: "/operator-dashboard/listings", icon: List },
    { title: "Add Service", url: "/operator-dashboard/new-listing", icon: Plus },
    { title: "Bookings", url: "/operator-dashboard/bookings", icon: Calendar },
  ];

  const consumerMenuItems = [
    { title: "Browse Services", url: "/browse", icon: List },
    { title: "My Orders", url: "/orders", icon: Calendar },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Check if user has admin access (wncp.ai domain)
  const isAdmin = user?.email?.endsWith('@wncp.ai') || false;
  
  const menuItems = user ? (currentMode === "operator" ? operatorMenuItems : consumerMenuItems) : [];

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-divider bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo - Better mobile positioning */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer flex-1 sm:flex-initial justify-center sm:justify-start"
            onClick={() => navigate("/")}
          >
            {isLandingPage && !user ? (
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                <h1 className="text-xl sm:text-2xl font-bold text-accent">SkyMarket</h1>
              </div>
            ) : (
              <h1 className="text-xl sm:text-2xl font-bold text-accent">SkyMarket</h1>
            )}
          </motion.div>

          {/* Desktop Navigation for Landing Page */}
          {isLandingPage && !user && (
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                to="/browse" 
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Browse Services
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                How It Works
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Become a Provider
              </Link>
            </nav>
          )}

          {/* Right Side - User Menu or Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 sm:gap-3 h-auto p-1 sm:p-2 hover:bg-background/80"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-foreground">
                        {getUserName()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {currentMode} Mode
                      </p>
                    </div>
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-border">
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold text-xs sm:text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserName()}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => switchMode(currentMode === "operator" ? "consumer" : "operator")}>
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    <span>Switch to {currentMode === "operator" ? "Consumer" : "Operator"}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    {menuItems.map((item) => (
                      <DropdownMenuItem key={item.title} onClick={() => handleNavigation(item.url)}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </DropdownMenuItem>
                    ))}
                   </DropdownMenuGroup>

                   {/* Admin Panel - Golden Glow for wncp.ai users */}
                   {isAdmin && (
                     <>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem 
                         onClick={() => handleNavigation("/admin")}
                         className="relative group cursor-pointer"
                       >
                         <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-500/20 to-yellow-600/20 blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="relative flex items-center">
                           <Crown className="mr-2 h-4 w-4 text-yellow-600" />
                           <span className="text-yellow-800 font-medium">Admin Panel</span>
                         </div>
                       </DropdownMenuItem>
                     </>
                   )}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Mobile Auth Dropdown for signed out users */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <span className="text-sm">Menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-background border border-border shadow-lg" align="end">
                    <DropdownMenuItem onClick={() => handleNavigation("/browse")}>
                      <List className="mr-2 h-4 w-4" />
                      <span>Browse Services</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/#how-it-works")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>How It Works</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/signup")}>
                      <Plane className="mr-2 h-4 w-4" />
                      <span>Become a Provider</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation("/login")}>
                      <span className="font-medium">Sign In</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/signup")}>
                      <span className="font-medium text-accent">Get Started</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="text-sm sm:text-base px-2 sm:px-4"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/signup")}
                  className="text-sm sm:text-base px-2 sm:px-4"
                >
                  {isLandingPage ? "Get Started" : "Sign Up"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default SharedHeader;