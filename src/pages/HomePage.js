
import React from 'react';
import ScrollWrapper from '../components/ScrollWrapper';
import SlideMenu from '../components/SlideMenu';
import RainMaker from '../components/BotSection/RainMaker';
import HeartSync from '../components/BotSection/HeartSync';
import FixItFrank from '../components/BotSection/FixItFrank';
import TellItLikeItIs from '../components/BotSection/TellItLikeItIs';

export default function HomePage() {
  return (
    <ScrollWrapper>
      <SlideMenu />
      <RainMaker />
      <HeartSync />
      <FixItFrank />
      <TellItLikeItIs />
    </ScrollWrapper>
  );
}
