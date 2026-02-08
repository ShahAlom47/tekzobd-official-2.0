
import OverviewContent from '@/components/Dashboard/DashOverView/OverviewContent';
import DashPageTitle from '@/components/Dashboard/DashPageTitle';
import React from 'react';

const DashboardHome = () => {
    return (
        <div className=' space-y-3 max-w  w-full'>
            <DashPageTitle>Overview</DashPageTitle>
           <OverviewContent></OverviewContent>
           {/* <TrafficAnalytics></TrafficAnalytics> */}
        </div>
    );
};

export default DashboardHome;