import { ArrowRight, Cloud, Server, Database, Code, Cpu, Link as LinkIcon, BadgeCheck, BookOpen, Target, Rocket, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import certAI from '@/shared/components/public/Cert/AI_practitioner.png';
import certSecurity from '@/shared/components/public/Cert/Aws_security_specialist.webp';
import certCloudPractitioner from '@/shared/components/public/Cert/cloudPractitioner.png';
import certDeveloper from '@/shared/components/public/Cert/developerAssociate.png';
import certDevOps from '@/shared/components/public/Cert/devopsEngineerProfessional.png';
import certSAA from '@/shared/components/public/Cert/solutionArchitectAssociate.png';
import certSAP from '@/shared/components/public/Cert/solutionArchitectProfessional.png';

import { HeroHeadline, HeroItem, HeroStage, Magnetic } from '@/shared/components/public/HeroMotion';
import { Reveal } from '@/shared/components/public/Reveal';
import { StaggerGroup, StaggerItem } from '@/shared/components/public/Stagger';
import { Button } from '@/shared/components/ui/button';

export const metadata = {
  title: 'About Us | Digo Academy',
  description: 'Learn Cloud from People Who Build on Cloud',
};

const VALUES = [
  {
    iconSrc: '/mission.png',
    title: 'Our Mission',
    body: 'Our team believes in “The expert in anything was once a beginner”. We aim to provide an access to the international level study approach to Nepali students and walk along the way from beginner to expert. Moreover, exposing them to the certification exams of big companies like Google, Microsoft, and Oracle.',
    color: 'text-brand-blue bg-brand-blue/10',
  },
  {
    iconSrc: '/vision.png',
    title: 'Our Vision',
    body: 'As per the strategies developed, we aim to provide education to more than 1000 students by this year and introduce more globally recognized courses with higher career scope. Not only that, we aim to provide 90% placement to our students.',
    color: 'text-violet-600 bg-violet-500/10 dark:text-violet-400',
  },
  {
    iconSrc: '/values.png',
    title: 'Our Values',
    body: 'We value hands-on, practical application over purely theoretical knowledge. Our top priority is to give the best to all of our students, providing technical and career support because education without application is just entertainment.',
    color: 'text-emerald-600 bg-emerald-500/10 dark:text-emerald-400',
  },
];

const AWS_CERTS = [
  { name: 'AWS Certified Cloud Practitioner', image: certCloudPractitioner },
  { name: 'AWS Certified AI Practitioner', image: certAI },
  { name: 'AWS Certified Solutions Architect - Associate', image: certSAA },
  { name: 'AWS Certified Developer - Associate', image: certDeveloper },
  { name: 'AWS Certified DevOps Engineer - Professional', image: certDevOps },
  { name: 'AWS Certified Solutions Architect - Professional', image: certSAP },
  { name: 'AWS Certified Security - Specialty', image: certSecurity },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-blue/5 via-background to-background pt-12 pb-12">
        <div className="animate-blob pointer-events-none absolute -left-32 -top-32 z-0 size-80 rounded-full bg-brand-blue/20 blur-3xl" />
        
        <HeroStage className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
          <HeroHeadline
            className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
            segments={[
              { text: 'Learn Cloud from' },
              { text: 'People', accent: true },
              { text: 'Who Build on Cloud.' },
            ]}
          />
          
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Digo Academy, the learning initiative of Digo Solution, helps students and IT professionals build practical skills in AWS, cloud, and DevOps.
            </p>
          </Reveal>
        </HeroStage>
      </section>

      {/* 2. Who We Are */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-16">
          <Reveal className="max-w-2xl text-left">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Who We Are
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Digo Academy is backed by the experience of Digo Solution, a technology company focused on cloud consulting, cloud infrastructure, migration, managed services, and cloud-native solutions. Our academy brings that real-world experience into the classroom, helping learners move beyond theory and understand how cloud technologies are actually designed, deployed, secured, monitored, and managed.
            </p>
          </Reveal>
          <Reveal delay={150} className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-sm ring-1 ring-border/60">
            <Image 
              src="/Aboutus.png" 
              alt="About Us" 
              fill
              className="object-cover"
            />
          </Reveal>
        </div>

        <StaggerGroup className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((val) => (
            <StaggerItem key={val.title}>
              <div className="h-full rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className={`flex size-14 items-center justify-center rounded-2xl ${val.color}`}>
                  <Image src={val.iconSrc} alt={val.title} width={32} height={32} className="object-contain" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                  {val.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {val.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 3. Backed by Digo Solution */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Learning Backed by Real-World Cloud Experience
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Digo Academy is part of the Digo Solution ecosystem. We bring our technical perspective into education so you learn not just what technologies are, but how they are applied.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-8">
              {/* Digo Solution Card */}
              <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-md flex flex-col">
                <div className="flex flex-col mb-8">
                  <Image src="/DigoSolution.png" alt="Digo Solution" width={180} height={50} className="object-contain h-10 w-auto self-start" />
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest mt-2 uppercase">Cloud / Consulting / Training</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto">
                  <div className="flex-1 w-full flex justify-center items-center h-40">
                    <Image src="/Cloud.png" alt="Cloud Infrastructure" width={160} height={160} className="object-contain max-h-40 w-auto" />
                  </div>
                  <div className="flex-1 w-full flex sm:justify-start">
                    <ul className="space-y-4 text-sm font-medium text-slate-700">
                      <li className="flex items-center gap-3"><Server className="size-5 text-blue-500 shrink-0" /> Cloud Consulting</li>
                      <li className="flex items-center gap-3"><Database className="size-5 text-blue-500 shrink-0" /> Cloud Migration</li>
                      <li className="flex items-center gap-3"><Cpu className="size-5 text-blue-500 shrink-0" /> DevOps</li>
                      <li className="flex items-center gap-3"><Code className="size-5 text-blue-500 shrink-0" /> Cloud-Native Apps</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Connecting Link */}
              <div className="flex items-center justify-center shrink-0 z-10 rotate-90 md:rotate-0 md:-mx-12">
                <div className="flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-4 ring-background">
                  <LinkIcon className="size-5" />
                </div>
              </div>

              {/* Digo Academy Card */}
              <div className="rounded-2xl border border-border/60 bg-white p-8 shadow-md flex flex-col">
                <div className="flex flex-col mb-8">
                  <Image src="/brand-logo.png" alt="Digo Academy" width={180} height={50} className="object-contain h-10 w-auto self-start" />
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest mt-2 uppercase">Cloud / DevOps / AI</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto">
                  <div className="flex-1 w-full flex justify-center items-center h-40">
                    <Image src="/Learning.png" alt="Learning" width={160} height={160} className="object-contain max-h-40 w-auto" />
                  </div>
                  <div className="flex-1 w-full flex sm:justify-start">
                    <ul className="space-y-4 text-sm font-medium text-slate-700">
                      <li className="flex items-center gap-3"><BookOpen className="size-5 text-blue-500 shrink-0" /> Learn</li>
                      <li className="flex items-center gap-3"><Target className="size-5 text-blue-500 shrink-0" /> Practice</li>
                      <li className="flex items-center gap-3"><Rocket className="size-5 text-blue-500 shrink-0" /> Build</li>
                      <li className="flex items-center gap-3"><TrendingUp className="size-5 text-blue-500 shrink-0" /> Grow</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex justify-center">
              <Button
                variant="ghost"
                className="group text-brand-blue hover:text-brand-blue hover:bg-brand-blue/10"
                nativeButton={false}
                render={
                  <a href="https://digosolution.com" target="_blank" rel="noopener noreferrer">
                    Explore Digo Solution
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                }
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Learn from Cloud Professionals */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Learn from Certified, Become Certified
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our training is supported by professionals with hands-on experience in AWS and modern cloud technologies. Our team includes AWS-certified professionals who bring practical knowledge from real cloud infrastructure and DevOps environments into our training programs.
          </p>
        </Reveal>

        <StaggerGroup className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {AWS_CERTS.map((cert) => (
            <StaggerItem key={cert.name}>
              <div className="flex flex-col items-center justify-center gap-3 p-2 transition-transform hover:-translate-y-1">
                <Image 
                  src={cert.image} 
                  alt={cert.name} 
                  width={137} 
                  height={137} 
                  className="object-contain w-[110px] h-[110px] sm:w-[137px] sm:h-[137px] drop-shadow-sm" 
                />
                <span className="font-medium text-xs text-foreground text-center max-w-[150px] hidden sm:block">{cert.name}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  );
}
