import React, { useEffect, useState } from 'react';
// import ChartWrapper from './ChartWrapper';
import { CustomerSettings } from './CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';


const ModularDashboard = () => {
    const { currentUser } = useAuth();
    const [customerMetrics, setCustomerMetrics] = useState([]);

    useEffect(() => {
        if (currentUser) {
            const customer = CustomerSettings.find((customer) => customer.email === currentUser.email);
            if (customer) {
                setCustomerMetrics(customer.metric);
            }
        }
    }, [currentUser]);

    return (
        <div>
            <h1>Modular Dashboard</h1>
            <div>
                {customerMetrics?.map((metric) => (
                    // <ChartWrapper key={metric} metric={metric} />
                    <p key={metric}>{metric}</p>
                ))}
                </div>
        </div>
    );
};

export default ModularDashboard;