// RoomContentArea.tsx

import React from 'react'
import { styled } from '@/styled-system/jsx'
import { cva } from '@/styled-system/css'
import { useSubtitles } from '@/features/subtitle/hooks/useSubtitles'
import { useSidePanel } from '@/features/rooms/livekit/hooks/useSidePanel'
import { Subtitles } from '@/features/subtitle/component/Subtitles'
import { MainNotificationToast } from '@/features/notifications/MainNotificationToast'

const RoomViewport = styled(
  'div',
  cva({
    base: {
      position: 'absolute',
      maxHeight: '100%',
      // Deliberately NOT reacting to the reaction toolbar here: that used to add
      // paddingBottom while the toolbar was open, which shrinks this viewport and,
      // combined with adaptiveStream's resize-observer, makes LiveKit repeatedly
      // re-request a lower-quality layer for any screen share/video every time
      // someone opens the toolbar or a reaction animates through it. The toolbar
      // renders as its own floating overlay (ControlBar.tsx), so it already sits
      // on top of the video without this padding - this just stops the video
      // viewport itself from resizing because of it.
      transition: 'inset .5s cubic-bezier(0.4,0,0.2,1) 5ms',
    },
    variants: {
      isSidePanelOpen: {
        true: {
          inset: `var(--lk-grid-gap) calc(var(--sizes-room-side-panel) + var(--sizes-room-side-panel-margin) * 2) calc(var(--sizes-room-control-bar)) 16px`,
        },
        false: {
          inset: `var(--lk-grid-gap) var(--lk-grid-gap) calc(var(--sizes-room-control-bar))`,
        },
      },
    },
  })
)

const TrackAreaContainer = styled(
  'div',
  cva({
    base: {
      position: 'relative',
      display: 'flex',
      width: '100%',
      transition: 'height .5s cubic-bezier(0.4,0,0.2,1) 5ms',
    },
    variants: {
      areSubtitlesOpen: {
        true: {
          height: 'calc(100% - 12rem)',
        },
        false: {
          height: '100%',
        },
      },
    },
  })
)

interface RoomContentAreaProps {
  children: React.ReactNode
}

export function RoomContentArea({ children }: RoomContentAreaProps) {
  const { isSidePanelOpen } = useSidePanel()
  const { areSubtitlesOpen } = useSubtitles()

  return (
    <RoomViewport isSidePanelOpen={isSidePanelOpen}>
      <TrackAreaContainer areSubtitlesOpen={areSubtitlesOpen}>
        {children}
      </TrackAreaContainer>
      <Subtitles />
      <MainNotificationToast />
    </RoomViewport>
  )
}
