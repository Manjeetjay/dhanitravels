import { createContext, useContext, useEffect, useState } from "react";
import { publicApi } from "../lib/api";

const AgencyContext = createContext(null);

export function useAgency() {
    return useContext(AgencyContext);
}

const defaultSettings = {
    agency_name: "Dhani Travels",
    logo_url: "",
    contact_phone: "+91 98765 43210",
    whatsapp_number: "919876543210",
    support_email: "hello@dhanijourneys.com",
    address: "123 Travel Lane, New Delhi, India",
    instagram_url: "#",
    facebook_url: "#",
    twitter_url: "#",
    youtube_url: "#"
};

export function AgencyProvider({ children }) {
    const [agency, setAgency] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const response = await publicApi.getSettings();
                if (response.data && Object.keys(response.data).length > 0) {
                    setAgency((prev) => ({ ...prev, ...response.data }));
                }
            } catch (err) {
                console.error("Failed to load agency settings:", err);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    return (
        <AgencyContext.Provider value={{ agency, loading }}>
            {children}
        </AgencyContext.Provider>
    );
}
