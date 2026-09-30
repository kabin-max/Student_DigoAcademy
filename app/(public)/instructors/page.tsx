import { Briefcase, Award, GraduationCap, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { HeroHeadline, HeroStage } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';

import cloudPractitionerImg from '@/shared/components/public/Cert/cloudPractitioner.png';
import solutionArchitectAssociateImg from '@/shared/components/public/Cert/solutionArchitectAssociate.png';
import solutionArchitectProfessionalImg from '@/shared/components/public/Cert/solutionArchitectProfessional.png';
import securitySpecialtyImg from '@/shared/components/public/Cert/security specialty.png';
import aiPractitionerImg from '@/shared/components/public/Cert/AI_practitioner.png';
import developerAssociateImg from '@/shared/components/public/Cert/developerAssociate.png';

export const metadata = {
  title: 'Instructors | Digo Academy',
  description: 'Meet the People Behind the Learning.',
};

const INSTRUCTORS = [
  {
    id: 'deepak-poudel',
    name: 'Deepak Poudel',
    role: 'Cloud Architect & Mentor',
    experience: '14+ Years Exp.',
    badge: 'Instructor',
    description: 'Specializing in enterprise cloud architecture and distributed systems. Helping students master complex cloud patterns and AWS best practices.',
    image: '/instructors/Dipak Poudel Sir.jpeg',
    linkedin: 'https://www.linkedin.com/in/poudeld/',
    website: 'https://dipakpoudel.com/',
    certifications: [
      { title: 'AWS Cloud Practitioner', image: cloudPractitionerImg },
      { title: 'AWS Solutions Architect Associate', image: solutionArchitectAssociateImg },
      { title: 'AWS Solutions Architect Professional', image: solutionArchitectProfessionalImg },
      { title: 'AWS Security Specialty', image: securitySpecialtyImg }
    ]
  },
  {
    id: 'sushan-aryal',
    name: 'Sushan Aryal',
    role: 'Cloud & DevOps Mentor',
    experience: '2+ Years Exp.',
    badge: 'Instructor',
    description: 'Passionate about cloud technologies and automation, I design and operate scalable cloud infrastructure and help teams build reliably.',
    image: '/instructors/SushanAryal.jpeg',
    linkedin: 'https://www.linkedin.com/in/sushan-aryal/',
    website: 'https://www.sushanaryal.com.np/',
    certifications: [
      { title: 'AWS Cloud Practitioner', image: cloudPractitionerImg },
      { title: 'AWS AI Practitioner', image: aiPractitionerImg },
      { title: 'AWS Solutions Architect Associate', image: solutionArchitectAssociateImg },
      { title: 'AWS Developer Associate', image: developerAssociateImg }
    ]
  },
  {
    id: 'kabin-shrestha',
    name: 'Kabin Shrestha',
    role: 'Cloud Developer & Mentor',
    experience: '2+ Years Exp.',
    badge: 'Instructor',
    description: 'Expert in full-stack development and serverless architectures. Helping developers transition into cloud-native application development.',
    image: '/instructors/Kabin.png',
    linkedin: 'https://www.linkedin.com/in/kabin-shrestha-516962281/',
    website: 'https://www.kabin55.com.np/',
    certifications: [
      { title: 'AWS Cloud Practitioner', image: cloudPractitionerImg },
      { title: 'AWS Solutions Architect Associate', image: solutionArchitectAssociateImg }
    ]
  }
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function InstructorsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FC]">
      <section className="relative overflow-hidden pt-12 pb-8">
        <HeroStage className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-5xl"
            segments={[
              { text: 'Meet the' },
              { text: 'People', accent: true },
              { text: 'Behind the Learning' },
            ]}
          />
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#475569]">
              Cloud practitioners who teach from real-world experience.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      <section className="mx-auto w-full sm:w-[90%] xl:w-[80%] max-w-[1600px] px-4 pb-24 sm:px-0">
        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
          {INSTRUCTORS.map((instructor) => (
            <StaggerItem key={instructor.id}>
              <div className="flex flex-col h-full rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">

                {/* Top Section */}
                <div className="p-5 xl:p-6 flex flex-col sm:flex-row gap-5 border-b border-[#E2E8F0] items-center sm:items-start">

                  {/* Avatar */}
                  <div className="shrink-0">
                    {instructor.image ? (
                      <div className="size-28 xl:size-32 rounded-2xl overflow-hidden bg-[#EBF0FF]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="size-28 xl:size-32 rounded-2xl bg-gradient-to-br from-[#1A4199] to-[#3B82F6] flex items-center justify-center text-4xl font-bold text-white shadow-inner">
                        {initials(instructor.name)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF0FF] text-[#1A4199] text-[11px] xl:text-xs font-semibold">
                        <GraduationCap className="size-3.5" />
                        {instructor.badge}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF0FF] text-[#1A4199] text-[11px] xl:text-xs font-semibold">
                        <Briefcase className="size-3.5" />
                        {instructor.experience}
                      </div>
                    </div>

                    {/* Name & Role */}
                    <h2 className="text-xl xl:text-2xl font-bold text-[#0F172A] mb-1 truncate w-full">{instructor.name}</h2>
                    <h3 className="text-sm xl:text-base font-semibold text-[#475569] mb-4 truncate w-full">{instructor.role}</h3>

                    {/* Links */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 xl:gap-3 text-[#1A4199] font-semibold text-xs xl:text-sm">
                      <a href={instructor.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline shrink-0">
                        <div className="bg-[#1A4199] text-white p-0.5 xl:p-1 rounded-sm">
                          <svg className="size-3 xl:size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </div>
                        Linkedin
                      </a>
                      <span className="text-[#CBD5E1]">|</span>
                      <a href={instructor.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline shrink-0">
                        <Globe className="size-3.5 xl:size-4" />
                        Website
                      </a>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 md:p-8 border-b border-[#E2E8F0]">
                  <p className="text-base text-[#334155] leading-relaxed text-left">
                    {instructor.description}
                  </p>
                </div>

                {/* Certifications Section */}
                <div className="p-6 md:p-8 flex-grow">
                  <div className="mb-4">
                    <h5 className="text-lg font-bold text-[#475569] flex items-center gap-2">
                      <Award className="size-5" />
                      Certifications
                    </h5>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
                    {instructor.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="transition-transform hover:scale-110 hover:shadow-md rounded-lg shrink-0"
                        title={cert.title}
                      >
                        <Image src={cert.image} alt={cert.title} width={70} height={70} className="object-contain size-[70px] drop-shadow-sm" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  );
}

