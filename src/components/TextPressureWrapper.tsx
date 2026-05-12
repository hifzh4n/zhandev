'use client';

import TextPressure from './TextPressure';

type TextPressureWrapperProps = {
  text: string;
};

export default function TextPressureWrapper({ text }: TextPressureWrapperProps) {
  return (
    <div style={{ position: 'relative', height: '170px' }}>
      <TextPressure
        text={text}
        flex
        alpha={false}
        stroke={false}
        width
        weight
        italic
        textColor="#ffffff"
        strokeColor="#5227FF"
        minFontSize={28}
      />
    </div>
  );
}
