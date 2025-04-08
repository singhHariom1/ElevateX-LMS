import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const MyLearning = () => {
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useLoadUserQuery();
  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    refetch: refetchPurchases,
  } = useGetPurchasedCoursesQuery();

  console.log("MyLearning - User Data:", userData); // Debug log
  console.log("MyLearning - Loading:", userLoading); // Debug log
  console.log("MyLearning - Error:", userError); // Debug log
  console.log("MyLearning - Purchase Data:", purchaseData); // Debug log for purchases

  const handleFixPurchaseStatus = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/purchase/fix-purchase-status",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Refetch data to update the UI
        window.location.reload();
      } else {
        toast.error("Failed to fix purchase status");
      }
    } catch (error) {
      console.error("Error fixing purchase status:", error);
      toast.error("Error fixing purchase status");
    }
  };

  if (userLoading || purchaseLoading) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl">MY LEARNING</h1>
        <div className="my-5">
          <MyLearningSkeleton />
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl">MY LEARNING</h1>
        <div className="my-5 text-red-500">
          Error loading your courses:{" "}
          {userError.message || "Unknown error occurred"}
        </div>
      </div>
    );
  }

  const myLearning = userData?.user?.enrolledCourses || [];
  console.log("MyLearning - Enrolled Courses:", myLearning); // Debug log

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {myLearning.length === 0 ? (
          <div>
            <p>You are not enrolled in any course.</p>
            {purchaseData?.purchasedCourse?.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-600 mb-2">
                  Note: You have {purchaseData.purchasedCourse.length} purchased
                  course(s) but they are not showing up in your enrolled
                  courses. This might be a synchronization issue.
                </p>
                <Button
                  onClick={handleFixPurchaseStatus}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Fix Course Enrollment
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myLearning.map((course, index) => (
              <Course key={index} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
