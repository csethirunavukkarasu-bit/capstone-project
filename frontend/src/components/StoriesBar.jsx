export default function StoriesBar({ onAddStoryClick, onSelectStory }) {

  const stories = [
    {
      id: 1,
      name: 'Perdana',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      time: '2h ago',
    },
    {
      id: 2,
      name: 'Ben Schade',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      time: '4h ago',
    },
    {
      id: 3,
      name: 'Stubka',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
      time: '5h ago',
    },
    {
      id: 4,
      name: 'Shea Lewis',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      time: '8h ago',
    },
    {
      id: 5,
      name: 'Sumesh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      time: '12h ago',
    },
    {
      id: 6,
      name: 'Elena Vance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      media: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      time: '1d ago',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        width: '100%',
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '-0.3px',
          }}
        >
          Stories
        </h3>
        <button
          onClick={() => onSelectStory(stories[0])}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-purple)',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Watch all ▶
        </button>
      </div>

      {/* Stories Horizontal Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 8,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Add Story Button */}
        <div
          onClick={onAddStoryClick}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: '50%',
              border: '2px dashed var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-card)',
              transition: 'all 0.25s ease',
            }}
            className="glow-on-hover"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
                boxShadow: 'var(--glow-purple)',
              }}
            >
              +
            </div>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Add story
          </span>
        </div>

        {/* Stories List */}
        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <div className="avatar-story-ring">
              <img
                src={story.avatar}
                alt={story.name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--bg-surface)',
                  background: 'var(--bg-canvas)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--text-primary)',
                maxWidth: 72,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
