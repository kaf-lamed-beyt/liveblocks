import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { Room } from "./Room";

export default function App() {
  const roomId = "{% ROOM_ID %}";
  const publicApiKey = "{% LIVEBLOCKS_PUBLIC_KEY %}";

  return (
    <LiveblocksProvider publicApiKey={publicApiKey} throttle={16}>
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          <Room />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
