import { PlayButton } from "components/Buttons";
import { HydraCanvas } from "components/HydraCanvas";
import { usePlayback } from "hooks/use-playback";
import * as React from "react";
import styled from "styled-components";
import type { HydraVis, TidalSong } from "types";

interface PlayerProps {
    /** The visualization to render */
    vis: HydraVis;
    /** The song to play */
    song: TidalSong;
}

/**
 * Show a full screen with a title section and a player.
 *
 * The player takes up at least the first screen height, obtained by stacking
 * the title section (specified as `children`) and an HTML canvas rendering the
 * visuals.
 */
export const PlayerA: React.FC<React.PropsWithChildren<PlayerProps>> = ({
    vis,
    song,
    children,
}) => {
    const [isPlaying, toggleIsPlaying, wasPlayingOnce] = usePlayback(song);

    return (
        <Container>
            <FirstScreen>
                {children}
                <CanvasGrid onClick={toggleIsPlaying} title="">
                    <CanvasContainer isVisible={wasPlayingOnce}>
                        <HydraCanvas {...{ vis, isPlaying }} />
                    </CanvasContainer>
                    <PlayButtonOverlay isVisible={!isPlaying}>
                        <PlayButton />
                    </PlayButtonOverlay>
                </CanvasGrid>
            </FirstScreen>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const FirstScreen = styled.div`
    display: flex;
    flex-direction: column;
    height: 100svh;
`;

const CanvasGrid = styled.div`
    flex-grow: 1;
    margin-block-end: 1.8rem;

    display: grid;
`;

interface CanvasContainerProps {
    isVisible: boolean;
}

const CanvasContainer = styled.div<CanvasContainerProps>`
    display: ${(props) => (props.isVisible ? "block" : "none")};
    grid-area: 1/-1;

    /* The canvas itself is "position: absolute" */
    position: relative;
`;

interface PlayButtonOverlayProps {
    isVisible: boolean;
}

const PlayButtonOverlay = styled.div<PlayButtonOverlayProps>`
    background-color: rgba(72, 65, 79, 0.15);
    backdrop-filter: blur(13px);

    grid-area: 1/-1;

    display: ${(props) => (props.isVisible ? "grid" : "none")};
    place-items: center;
`;
