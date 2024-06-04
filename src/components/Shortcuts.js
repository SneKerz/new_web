import React from 'react'
import styled from 'styled-components'
import { Icon } from '@react95/core'
import {startWebamp} from '../utils/startWebamp';
import dexscreener from './dexscreener.ico'

const StyledShorcut = styled.div`
    margin-left: 20px;
    margin-top: 20px;
	align-items: center;
`;

function Shortcuts({ openExplorer }) {
    return (
        <div>
            <StyledShorcut>
                <Icon
                    className="pointer"
                    name="windows_explorer"
                    onClick={() => openExplorer()}
                />
                <div>Explorer</div>
            </StyledShorcut>
            <StyledShorcut>
                <Icon
                    className="pointer"
                    name="media_cd"
                    onClick={()=>startWebamp()}
                />
                <div>Media</div>
            </StyledShorcut>
            <StyledShorcut>
            <Icon
    className="pointer"
    name="dexscreener"
    onClick={() => window.location.href = "https://dexscreener.com/"}
/>

                <div>Dex<br></br>Screener</div>
            </StyledShorcut>
            <StyledShorcut>
            <Icon
    className="pointer"
    name="dextools"
    onClick={() => window.location.href = "https://www.dextools.io/app/en/solana/socials-recently-updated"}
/>

                <div>DexTools</div>
            </StyledShorcut>
        </div>
    )
}

export default Shortcuts
