'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { cn } from '@/lib/utils'
import { animate, motion } from 'framer-motion'



//import { GoCopilot } from "react-icons/go"

export function FeatureAnimatedCard() {
  return (
    <CardSkeletonContainer>
      <Skeleton />
    </CardSkeletonContainer>
  )
}

const Skeleton = () => {
  const scale = [1, 1.1, 1]
  const transform = ['translateY(0px)', 'translateY(-4px)', 'translateY(0px)']
  const sequence = [
    [
      '.circle-1',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-2',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-3',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-4',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      '.circle-5',
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ]

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Infinity,
      repeatDelay: 1,
    })
  }, [])
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden p-8">
      <div className="flex flex-shrink-0 flex-row items-center justify-center gap-2">
        <Container className="circle-1 size-20">
          <ClaudeLogo className="size-10 " />
        </Container>
        <Container className="circle-2 size-24">
          <GoCopilot className="size-12 dark:text-white" />
        </Container>
        <Container className="circle-3 size-28">
          <OpenAILogo className="size-18 dark:text-white" />
        </Container>
        <Container className="circle-4 size-24">
          <MetaIconOutline className="size-12 " />
        </Container>
        <Container className="circle-5 size-20">
          <GeminiLogo className="size-10 " />
        </Container>
      </div>

      <div className="animate-move absolute top-20 z-40 m-auto h-40 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent">
        <div className="absolute top-1/2 -left-10 h-32 w-10 -translate-y-1/2">
          <Sparkles />
        </div>
      </div>
    </div>
  )
}
export const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1
  const randomOpacity = () => Math.random()
  const random = () => Math.random()
  return (
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `4px`,
            height: `4px`,
            borderRadius: '50%',
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  )
}

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string
  children: React.ReactNode
  showGradient?: boolean
}) => {
  return (
    <div
      className={cn(
        'z-40 h-[15rem] rounded-xl md:h-[20rem] ',
        className,
        showGradient &&
          ' ',
      )}
    >
      {children}
    </div>
  )
}

const Container = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        `flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ClaudeLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'assets/icons/file-audio.svg'}
      width={48}
      height={48}
      alt="file-document"
      className={className}
    />
  )
}

export const OpenAILogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'assets/icons/download.svg'}
      width={48}
      height={48}
      alt="file-document"
      className={className}
    />
  )
}
export const GeminiLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'assets/icons/edit.svg'}
      width={48}
      height={48}
      alt="file-document"
      className={className}
    />
  )
}

export const MetaIconOutline = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'assets/icons/file-document.svg'}
      width={48}
      height={48}
      alt="file-document"
      className={className}
    />
  )
}

export const GoCopilot = ({ className }: { className?: string }) => {
  return (
    <Image
      src={'assets/icons/file-image.svg'}
      width={48}
      height={48}
      alt="file-document"
      className={className}
    />
  )
}
