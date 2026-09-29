import { MapPin, Navigation, ExternalLink, Bus, Train, Car } from "lucide-react";

interface VenueMapProps {
  venue: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

export function VenueMap({ venue, address }: VenueMapProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    "Future Institute of Engineering and Management, Sonarpur Station Rd, Kolkata"
  )}`;

  return (
    <div id="venue-map-section" className="bg-white border border-[#DADCE0] rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Venue Info Col */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>Campus Venue</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#202124] mb-2">{venue}</h3>
            <p className="text-sm text-[#5F6368] mb-6 leading-relaxed flex items-start gap-2">
              <span>{address}</span>
            </p>

            {/* Travel Guidance */}
            <div className="space-y-3 pt-4 border-t border-[#DADCE0]">
              <h4 className="text-xs font-semibold text-[#5F6368] uppercase tracking-wider">
                How to Reach FIEM Campus
              </h4>

              <div className="flex items-start gap-3 text-xs text-[#3C4043]">
                <Train className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#202124]">By Suburban Local Train:</span>
                  <p className="text-[#5F6368]">Sonarpur Junction is 5-8 mins by rickshaw or auto to the college campus gate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#3C4043]">
                <Bus className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#202124]">By Bus & Auto:</span>
                  <p className="text-[#5F6368]">Direct buses and shared autos connect from Garia, Ruby, and Tollygunge Metro.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#3C4043]">
                <Car className="w-4 h-4 text-[#FBBC04] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#202124]">Parking:</span>
                  <p className="text-[#5F6368]">Visitor two-wheeler and four-wheeler parking available near Main Gate 2.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#DADCE0]">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              id="get-directions-btn"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#1A73E8] hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-80" />
            </a>
          </div>
        </div>

        {/* Map Embed Col */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px] bg-neutral-100 border-t lg:border-t-0 lg:border-l border-[#DADCE0]">
          <iframe
            title="Google Maps Location of FIEM"
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Future%20Institute%20of%20Engineering%20and%20Management%20Kolkata&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />

          {/* Floating Campus Overlay Tag */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-[#DADCE0] px-3 py-2 rounded-xl text-xs text-[#202124] shadow-md hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-pulse" />
            <span className="font-semibold">FIEM Campus Main Ground</span>
          </div>
        </div>
      </div>
    </div>
  );
}
