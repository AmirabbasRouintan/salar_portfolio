"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { useState, useEffect, useCallback } from "react";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import Image, { StaticImageData } from "next/image"; // Imported StaticImageData
import { AnimatedList } from "@/components/magicui/animated-list";
import { AuroraText } from "@/components/magicui/aurora-text";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { MorphingText } from "@/components/magicui/morphing-text";
import { HyperText } from "@/components/magicui/hyper-text";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";

// Image imports (these are StaticImageData objects)
import plastic1 from "./blog/plastic1.png";
import plastic2 from "./blog/plastic2.png";
import nvim1 from "./blog/nvim1.png";
import nvim2 from "./blog/nvim2.png";
import python1 from "./blog/python_tel_bot1.png";
import python2 from "./blog/python_tel_bot2.png";
import python3 from "./blog/python_tel_bot3.png";
import python4 from "./blog/python_tel_bot4.png";
import eco1 from "./blog/eco1.png";
import eco2 from "./blog/eco2.png";
import eco3 from "./blog/eco3.png";
import eco4 from "./blog/eco4.png";
import eco5 from "./blog/eco5.png";
import eco6 from "./blog/eco6.png";
import ifi_web from "./blog/more.png";

const BLUR_FADE_DELAY = 0.04;

interface ProjectCardProps {
  delay: number;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  linkText?: string;
  imageUrls: StaticImageData[]; // Changed from string[] to StaticImageData[]
}

function ProjectCard({ delay, title, description, tags, link, linkText, imageUrls }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [drawerLoading, setDrawerLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulate drawer image loading delay for demonstration if needed,
    // but actual loading is handled by onLoadingComplete
    const drawerTimer = setTimeout(() => {
        if (imageUrls.length === 0) { // If no images, stop drawer loading immediately
            setDrawerLoading(false);
        }
    }, 500); // Adjust if a slight delay is desired before images might load

    return () => {
        clearTimeout(timer);
        clearTimeout(drawerTimer);
    }
  }, [imageUrls.length]);

  // Handles completion of all images in the drawer
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  useEffect(() => {
    if (imageUrls.length > 0 && loadedImagesCount === imageUrls.length) {
      setDrawerLoading(false);
    }
  }, [loadedImagesCount, imageUrls.length]);

  const handleImageLoad = () => {
    setLoadedImagesCount(prevCount => prevCount + 1);
  };


  return (
    <BlurFade delay={delay}>
      <Drawer onOpenChange={(open) => {
        // Reset drawer loading state when drawer is opened or closed
        if (open) {
          setDrawerLoading(true);
          setLoadedImagesCount(0); // Reset count when opening
        }
      }}>
        <DrawerTrigger className="text-left w-full">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
            {isLoading ? (
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-[125px] w-full rounded-lg mb-3" />
                <Skeleton className="h-[20px] w-[200px] rounded-full" />
                <Skeleton className="h-[15px] w-[150px] rounded-full" />
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((_, index) => (
                    <Skeleton key={index} className="h-[20px] w-[60px] rounded-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {imageUrls[0] && (
                  <div className="relative w-full h-[125px] mb-3">
                    <Image
                      src={imageUrls[0]} // Accepts StaticImageData
                      alt={`${title} preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground flex-grow">{description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index}>{tag}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            {drawerLoading && imageUrls.length > 0 && ( // Only show skeleton if there are images to load
              <div className="space-y-4">
                {imageUrls.map((_, index) => (
                  <Skeleton key={index} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            )}
            <div className={`flex flex-col gap-4 ${drawerLoading && imageUrls.length > 0 ? "hidden" : "block"}`}>
              {imageUrls.map((imageUrl, index) => (
                <div key={index} className="w-full relative aspect-[4/3] max-h-[400px]"> {/* Added aspect ratio for consistent image display */}
                  <Image
                    src={imageUrl} // Accepts StaticImageData
                    alt={`${title} image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                    className="rounded-lg object-contain"
                    onLoad={handleImageLoad} // Changed from onLoadingComplete for individual tracking
                    onError={() => { // Handle image loading errors
                        console.error(`Error loading image: ${imageUrl}`);
                        handleImageLoad(); // Still count it as "loaded" to prevent infinite loading state
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <DrawerFooter>
            {link && (
              <Button asChild>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {linkText || "View Project"}
                </a>
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </BlurFade>
  );
}

export default function Page() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10 px-4 md:px-8 lg:px-16 py-8"> {/* Added padding for better layout */}
      {/* Hero Section */}
      <section id="hero" className="w-full">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between items-start"> {/* Adjusted alignment */}
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <MorphingText
                  texts={["Hi, I'm Amirabbas", "Hi, I'm ixi_flower"]}
                  className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl/none" // Adjusted sizes
                />
              </BlurFade>
              <BlurFadeText
                className="max-w-[400px] text-sm sm:text-base md:text-lg text-muted-foreground" // Adjusted sizes and added text-muted-foreground
                delay={BLUR_FADE_DELAY + 0.05} // Slight stagger
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-24 sm:size-28 border"> {/* Responsive avatar size */}
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-3xl mx-auto"> {/* Centered and max-width */}
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4">About</SparklesText> {/* Adjusted size and margin */}
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Markdown className="prose max-w-full text-pretty font-sans text-sm sm:text-base text-muted-foreground dark:prose-invert">
            {DATA.summary}
          </Markdown>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4.1}>
          <div className="mt-6"> {/* Increased margin */}
            <InteractiveHoverButton>
              <a
                href="https://www.udemy.com/certificate/UC-9842c80b-e377-4960-b027-83a31256595d/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2" // Adjusted padding
              >
                View Python Udemy Certificate
              </a>
            </InteractiveHoverButton>
          </div>
        </BlurFade>
      </section>

      {/* Work Experience Section */}
      <section id="work" className="w-full max-w-3xl mx-auto"> {/* Centered and max-width */}
        <div className="flex min-h-0 flex-col gap-y-4"> {/* Increased gap */}
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4">Work Experience</SparklesText> {/* Adjusted size and margin */}
          </BlurFade>
          {DATA.work.map((work, id) => (
            <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 6 + id * 0.05}>
              <ResumeCard
                logoUrl={work.logoUrl}
                altText={work.company}
                title={work.company}
                subtitle={work.title}
                href={work.href ?? undefined}
                badges={work.badges}
                period={`${work.start} - ${work.end ?? "Present"}`}
                description={work.description}
              />
            </BlurFade>
          ))}
        </div>
      </section>

{/* Education Section */}
<section id="education">
  <div className="flex min-h-0 flex-col gap-y-3">
    <BlurFade delay={BLUR_FADE_DELAY * 7}>
      <SparklesText className="text-2xl">Education - Courses</SparklesText>
    </BlurFade>
    {DATA.education
      // Modify this line to use an explicit type guard
      ?.filter(
        (edu): edu is Exclude<typeof DATA.education[number], null | undefined> => Boolean(edu)
      )
      .map((education, id) => (
        // Now, 'education' within this map is guaranteed to be non-nullable
        <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 8 + id * 0.05}>
          <ResumeCard
            href={education.href ?? undefined}
            logoUrl={education.logoUrl}
            altText={education.school}
            title={education.school}
            subtitle={education.degree}
            period={`${education.start} - ${education.end}`}
          />
        </BlurFade>
      ))}
  </div>
</section>
      {/* Skills Section */}
      <section id="skills" className="w-full max-w-3xl mx-auto"> {/* Centered and max-width */}
        <div className="flex min-h-0 flex-col gap-y-3">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <SparklesText className="text-2xl sm:text-3xl font-semibold mb-4">Skills</SparklesText> {/* Adjusted size and margin */}
          </BlurFade>
          <div className="flex flex-wrap gap-2"> {/* Increased gap */}
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
                <Badge variant="secondary" className="text-sm px-3 py-1">{skill}</Badge> {/* Styled badge */}
              </BlurFade>
            ))}
          </div>
          <div className="mt-4"> {/* Added margin for VelocityScroll */}
            <VelocityScroll defaultVelocity={1} className="font-semibold text-muted-foreground"> {/* Changed to number, added styling */}
              Linux • Python • React • Node.js • React Native • Django • SQL • Docker • Kubernetes • HTML/CSS • SEC
            </VelocityScroll>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full">
        <div className="space-y-12 w-full py-12">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  My Projects
                </div>
                <SparklesText className="text-2xl sm:text-3xl">Check out my latest work</SparklesText> {/* Adjusted size */}
              </div>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto"> {/* Adjusted grid and max-width */}
            {/* Project Cards - ensure imageUrls are passed correctly */}
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12}
              title="Our First React Website"
              description="Our first react project, FrontEnd: Freakless, BackEnd: Amirabbas (ixi_flower)"
              tags={["React", "Vite", "JS"]}
              link="#" // Consider adding actual links
              linkText="View Details" // Example link text
              imageUrls={[plastic1, plastic2]}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.05}
              title="My nvim config (old)"
              description="My previous Neovim configuration file. My new one is better 😁"
              tags={["Neovim", "Lua"]}
              link="#"
              linkText="View Config"
              imageUrls={[nvim1, nvim2]}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.1}
              title="Python Telegram Bot Maker"
              description="A tool to create Telegram bots with Python. Easy to use, just choose some options! 😎"
              tags={["Python", "Telegram API", "OOP"]}
              link="#"
              linkText="See on GitHub"
              imageUrls={[python3, python1, python2, python4]}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.15}
              title="React Ecommerce"
              description="A full-featured ecommerce frontend concept."
              tags={["React", "Tailwind CSS", "Vite", "Django"]}
              link="#"
              linkText="Explore Demo"
              imageUrls={[eco1, eco2, eco3, eco4, eco5, eco6]}
            />
            <ProjectCard
              delay={BLUR_FADE_DELAY * 12.20} // Adjusted delay slightly
              title="ifi-Web"
              description="Find anything on the internet (Youtube, Instagram, X, etc.). Frontend: Freakless, Backend: ixi_flower"
              tags={["React", "Tailwind CSS", "TypeScript", "Vite", "Django"]}
              link="#"
              linkText="Visit Site"
              imageUrls={[ifi_web]}
            />
          </div>
        </div>
      </section>

      {/* Hackathons Section */}
      <section id="hackathons" className="w-full max-w-3xl mx-auto"> {/* Centered and max-width */}
        <div className="space-y-12 w-full py-12 text-center"> {/* Centered text */}
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Hackathons & Training
                </div>
                <SparklesText className="text-2xl sm:text-3xl">Now what I’m doing?</SparklesText> {/* Adjusted size */}
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg/relaxed"> {/* Adjusted size and line height */}
                  I’m currently sharpening my cybersecurity skills by attending a class at the{" "}
                  <AuroraText className="font-semibold">OWASP Zero</AuroraText> course at{" "}
                  <AuroraText className="font-semibold">voorivex Academy</AuroraText>, diving deep into web application
                  security and vulnerability exploitation.
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section w-full">
        <div className="relative grid items-center justify-center gap-4 px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 overflow-hidden"> {/* Increased padding */}
          <AnimatedGridPattern
            numSquares={30} // Increased density
            maxOpacity={0.07} // Slightly more subtle
            duration={4} // Slower animation
            repeatDelay={1}
            className="absolute inset-0 z-0 h-full w-full [--color-primary:var(--foreground)]" // Use theme color
          />
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <div className="relative z-10 space-y-4 text-center mx-auto"> {/* Increased spacing */}
              <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm mx-auto">
                Contact
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter md:text-5xl"> {/* Adjusted sizes */}
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[90%] sm:max-w-[600px] text-muted-foreground text-sm sm:text-base md:text-lg"> {/* Adjusted sizes */}
                Want to chat? Just shoot me a dm{" "}
                <Link href={DATA.contact.social.X.url} className="text-primary hover:underline font-medium"> {/* Use primary theme color */}
                  with a direct question on X (Twitter)
                </Link>{" "}
                or connect with me on my socials below. I will ignore all soliciting.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8"> {/* Increased margin and gap */}
              {Object.entries(DATA.contact.social).map(([name, socialLink], id) => (
                 socialLink.url && ( // Check if URL exists
                    <BlurFade key={name} delay={BLUR_FADE_DELAY * (17 + id * 0.1)}>
                        <InteractiveHoverButton> {/* Consistent button size */}
                        <a
                            href={socialLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2" // Added flex for icon alignment
                        >
                            {/* Basic icon placeholder - replace with actual icons if available */}
                            {socialLink.icon && <socialLink.icon className="h-4 w-4" />}
                            {name}
                        </a>
                        </InteractiveHoverButton>
                    </BlurFade>
                 )
              ))}
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}

