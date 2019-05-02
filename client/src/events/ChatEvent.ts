class ChatEvent {
  public static readonly GUEST_CONNECTED = 'GUEST_CONNECTED';
  public static readonly GUEST_DISCONNECTED = 'GUEST_DISCONNECTED';
  public static readonly MY_MESSAGE_FROM_SERVER = 'MY_MESSAGE_FROM_SERVER';
  public static readonly OTHERS_MESSAGE_FROM_SERVER = 'OTHERS_MESSAGE_FROM_SERVER';
  public static readonly MESSAGE_FROM_CLIENT = 'MESSAGE_FROM_CLIENT';

  public static readonly ERROR = 'ERROR';
  public static readonly JOIN_ROOM = 'JOIN_ROOM';
}

export default ChatEvent;