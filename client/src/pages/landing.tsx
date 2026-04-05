import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Clock, Search } from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div> */}
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center">
                  {/* --- START: CUSTOM LOGO IMAGE --- */}
                  <img
                    className="h-8 w-8 object-contain" // Adjust h-8 and w-8 for your logo's size. object-contain keeps aspect ratio.
                    src="/TCS_NewLogo_Final_CMYK_Black.png" // IMPORTANT: Update this path to your logo file
                    alt="Your Company Logo Icon" // Always use descriptive alt text for accessibility
                  />
                  {/* --- END: CUSTOM LOGO IMAGE --- */}

                  <h1 className="ml-3 text-sm font-semibold text-gray-900">
                    TCS Executive Meeting Planner
                  </h1>
                </div>
              </div>
            </div>
            <Button onClick={handleSignIn} className="bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to TCS Executive Meeting Planner
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Professional meeting scheduler for teams and individuals
            </p>
            <Button 
              onClick={handleSignIn} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Get Started
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Schedule Meetings</h3>
                <p className="text-sm text-gray-600">
                  Create and manage meetings with ease
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Find Colleagues</h3>
                <p className="text-sm text-gray-600">
                  Search and view other users' schedules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Track Time</h3>
                <p className="text-sm text-gray-600">
                  Manage your time effectively
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-sm text-gray-600">
                  Quickly find meetings and users
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
