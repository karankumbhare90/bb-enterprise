import React from "react";
import { FaLinkedinIn, FaTwitter, FaEnvelope } from "react-icons/fa";
import IntroText from "./IntroText";
import { teamData } from "../data/data";

export default function OurTeam() {
  return (
    <section className="bg-surface w-full flex justify-center py-20 border-b border-outline-variant/10" id="team">
      <div className="inner-wrap">
        <div className="container w-full px-gutter sm:px-0">
          
          <div className="flex justify-center text-center mb-xl">
            <IntroText
              tagline={teamData.tagline}
              title={teamData.title}
              description={teamData.description}
              align="center"
              className="max-w-3xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
            {teamData.members.map((member, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-2xl bg-surface-low shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="aspect-[3/4] w-full relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for better readability of text on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0" />
                  
                  {/* Info Panel that appears on hover */}
                  <div className="absolute inset-0 p-lg flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-headline-sm text-white font-semibold mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {member.name}
                    </h3>
                    <p className="text-label-md font-medium text-tertiary mb-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                      {member.position}
                    </p>
                    
                    <div className="flex items-center gap-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                      <a 
                        href={member.socials.linkedin} 
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-primary transition-all duration-300"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedinIn className="text-lg" />
                      </a>
                      <a 
                        href={member.socials.twitter} 
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-primary transition-all duration-300"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="text-lg" />
                      </a>
                      <a 
                        href={member.socials.email} 
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-primary transition-all duration-300"
                        aria-label="Email"
                      >
                        <FaEnvelope className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
