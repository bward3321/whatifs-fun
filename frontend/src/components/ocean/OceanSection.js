import { memo } from 'react';
import { motion } from 'framer-motion';
import { MarineCreature } from './MarineCreature';
import { DepthMarker } from './DepthMarker';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8 },
};

const fadeInSlow = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.2 },
};

export const OceanSection = memo(function OceanSection({ section, onRestart }) {
  if (section.type === 'title') return <TitleSection section={section} />;
  if (section.type === 'ending') return <EndingSection onRestart={onRestart} />;
  return <StandardSection section={section} />;
});

function TitleSection({ section }) {
  return (
    <section
      className="ocean-section title-section"
      style={{ minHeight: section.minHeight }}
      data-testid="section-surface"
    >
      <div className="sunlight-rays" />
      <div className="wave-surface" />

      <div className="title-content">
        <motion.h1 className="title-text" {...fadeInSlow}>
          How Deep Is the Ocean&hellip; Really?
        </motion.h1>
        <motion.p
          className="subtitle-text"
          {...fadeIn}
          transition={{ duration: 1, delay: 0.5 }}
        >
          You&rsquo;re about to descend nearly 11,000 meters.
        </motion.p>
      </div>

      <motion.div
        className="scroll-indicator"
        {...fadeIn}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="scroll-arrow" />
        <span>Scroll to descend</span>
      </motion.div>

      {section.creatures?.length > 0 && (
        <div className="creatures-container" style={{ minHeight: '22vh' }}>
          {section.creatures.map(c => (
            <MarineCreature key={c.creatureKey} {...c} />
          ))}
        </div>
      )}

      <div className="text-content" style={{ marginTop: '12vh' }}>
        {section.stats?.map((stat, i) => (
          <motion.p
            key={i}
            className="stat-text"
            {...fadeIn}
            transition={{ duration: 0.8, delay: i * 0.25 }}
          >
            {stat}
          </motion.p>
        ))}
        {section.comparison && (
          <motion.p
            className="comparison-text"
            {...fadeIn}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {section.comparison}
          </motion.p>
        )}
      </div>
    </section>
  );
}

function EndingSection({ onRestart }) {
  return (
    <section
      className="ocean-section ending-section"
      style={{ minHeight: '200vh' }}
      data-testid="section-ending"
    >
      <motion.p
        className="ending-text"
        {...fadeInSlow}
        transition={{ duration: 2 }}
      >
        You have reached the deepest known point on Earth.
      </motion.p>
      <motion.p
        className="ending-text"
        {...fadeInSlow}
        transition={{ duration: 2, delay: 0.6 }}
      >
        Yet we have explored more of Mars than of our own ocean.
      </motion.p>
      <motion.p
        className="ending-text ending-final"
        {...fadeInSlow}
        transition={{ duration: 2, delay: 1.2 }}
      >
        The ocean is Earth&rsquo;s last frontier.
      </motion.p>
      <motion.button
        className="restart-button"
        onClick={onRestart}
        data-testid="restart-button"
        {...fadeIn}
        transition={{ duration: 1, delay: 1.8 }}
      >
        Explore Another Wonder
      </motion.button>
    </section>
  );
}

function StandardSection({ section }) {
  const {
    id, minHeight, creatures, depthLabel, subtitle,
    stats, comparison, note, floatingStats,
  } = section;

  return (
    <section
      className="ocean-section standard-section"
      style={{ minHeight }}
      data-testid={`section-${id}`}
    >
      {creatures?.length > 0 && (
        <div className="creatures-container">
          {creatures.map(c => (
            <MarineCreature key={c.creatureKey} {...c} />
          ))}
        </div>
      )}

      {depthLabel && <DepthMarker label={depthLabel} />}

      <div className="text-content">
        {subtitle && (
          <motion.h2 className="section-subtitle" {...fadeIn}>
            {subtitle}
          </motion.h2>
        )}
        {stats?.map((stat, i) => (
          <motion.p
            key={i}
            className="stat-text"
            {...fadeIn}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
          >
            {stat}
          </motion.p>
        ))}
        {comparison && (
          <motion.p
            className="comparison-text"
            {...fadeIn}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            {comparison}
          </motion.p>
        )}
        {note && (
          <motion.p
            className="note-text"
            {...fadeIn}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            {note}
          </motion.p>
        )}
      </div>

      {floatingStats?.length > 0 && (
        <div className="floating-stats-wrapper">
          {floatingStats.map((stat, i) => (
            <motion.p
              key={i}
              className="floating-stat"
              {...fadeIn}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              {stat}
            </motion.p>
          ))}
        </div>
      )}
    </section>
  );
}
