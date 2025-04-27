// Mock discord.js and capture the client instance
let mockClient;
jest.mock('discord.js', () => {
  // Create a simple Collection class mock
  class Collection {
    constructor() {
      this.items = new Map();
    }
    set(key, value) {
      this.items.set(key, value);
      return this;
    }
    get(key) {
      return this.items.get(key);
    }
  }
  
  mockClient = {
    once: jest.fn(),
    on: jest.fn(),
    login: jest.fn().mockResolvedValue('token'),
    user: {
      tag: 'TestBot#1234'
    },
    commands: new Collection()
  };
  
  return {
    Client: jest.fn(() => mockClient),
    Collection: jest.fn(() => new Collection()),
    Events: {
      ClientReady: 'ready',
      InteractionCreate: 'interactionCreate'
    },
    GatewayIntentBits: {
      Guilds: 1
    }
  };
});

// Mock fs and path to avoid file system operations
jest.mock('node:fs', () => ({
  readdirSync: jest.fn().mockReturnValue([])
}));

jest.mock('node:path', () => ({
  join: jest.fn().mockReturnValue('')
}));

// Mock dotenv config to provide a test token
jest.mock('dotenv', () => ({
  config: jest.fn(() => {
    process.env.DISCORD_TOKEN = 'test-token';
    return {};
  })
}));

// Mock console.log and console.error
console.log = jest.fn();
console.error = jest.fn();

describe('Discord Bot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset modules to ensure a fresh import for each test
    jest.resetModules();
    
    // Import the index.js file to trigger the bot initialization
    require('../index.js');
  });

  test('should register ClientReady event handler', () => {
    // Check if once was called correctly
    expect(mockClient.once).toHaveBeenCalledWith('ready', expect.any(Function));
  });

  test('should attempt to log in with the token from environment', () => {
    // Check if login was called with the token
    expect(mockClient.login).toHaveBeenCalledWith('test-token');
  });

  test('should log ready message when client is ready', () => {
    // Get the callback that was passed to client.once
    const readyCallback = mockClient.once.mock.calls[0][1];
    
    // Call the ready callback
    readyCallback(mockClient);
    
    // Verify the console log message
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Ready!, Logged in as TestBot#1234')
    );
  });
});