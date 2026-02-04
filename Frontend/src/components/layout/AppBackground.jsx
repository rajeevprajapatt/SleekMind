import React from "react";
import LightRays from "../../animations/LightRays";

const AppBackground = ({ children }) => {
    return (
        <>
            {/* Fixed animated background */}
            <div className="fixed inset-0 -z-10 bg-black">
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#ffffff"
                        raysSpeed={1}
                        lightSpread={0.5}
                        rayLength={3}
                        followMouse={true}
                        mouseInfluence={0.1}
                        noiseAmount={0}
                        distortion={0}
                        className="custom-rays"
                        pulsating={false}
                        fadeDistance={1}
                        saturation={1}
                    />
                </div>
            </div>

            {/* Scrollable content */}
            <div className="relative z-10 min-h-screen">
                {children}
            </div>
        </>
    );
};

export default AppBackground;