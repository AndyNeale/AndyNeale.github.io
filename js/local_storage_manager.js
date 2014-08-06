// Add setObj and getObj functions to local storage
Storage.prototype.setObj = function( key, obj ) {
  return this.setItem( key, JSON.stringify( obj ) ) ;
}
Storage.prototype.getObj = function( key ) {
  return JSON.parse( this.getItem( key ) ) ;
}

window.fakeStorage = {
  _data: {},

  setItem: function( id, val ) {
    return this._data[ id ] = String( val ) ;
  },

  getItem: function( id ) {
    return this._data.hasOwnProperty( id ) ? this._data[ id ] : undefined;
  },

  removeItem: function( id ) {
    return delete this._data[ id ] ;
  },

  clear: function() {
    return this._data = {} ;
  }
} ;

function LocalStorageManager() {
  this.bestScoreKey     = "bestScore" ;
  this.gameStateKey     = "gameState" ;
  this.maxMovesToStore  = 50 ;

  var supported = this.localStorageSupported() ;
  this.storage = supported ? window.localStorage : window.fakeStorage ;
}

LocalStorageManager.prototype.localStorageSupported = function() {
  var testKey = "test" ;
  var storage = window.localStorage ;

  try {
    storage.setItem( testKey, "1" ) ;
    storage.removeItem( testKey ) ;
    return true ;
  } catch ( error ) {
    return false ;
  }
} ;

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function() {
  return this.storage.getItem( this.bestScoreKey ) || 0 ;
} ;

LocalStorageManager.prototype.setBestScore = function( score ) {
  this.storage.setItem( this.bestScoreKey, score ) ;
} ;

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function() {
  // Get game state from local storage
  var stateJSON = this.storage.getObj( this.gameStateKey ) ;
  // Exit if no game state exists
  if ( !stateJSON ) return null ;
  // Convert to array
  stateJSON = [].concat( stateJSON ) ;
  return stateJSON[ stateJSON.length - 1 ] ;
} ;

LocalStorageManager.prototype.setGameState = function( gameState ) {
  // Get game state from local storage
  var stateJSON = this.storage.getObj( this.gameStateKey ) ;
  // Convert to array
  if ( stateJSON ) {
    stateJSON = [].concat( stateJSON ) ;
  } else {
    stateJSON = [] ;
  } ;
  // Push latest game state to top of stack
  stateJSON.push( gameState ) ;
  // Truncate if necessary
  if ( stateJSON.length > this.maxMovesToStore ) stateJSON.length = this.maxMovesToStore ;
  // Store back to local storage
  this.storage.setObj( this.gameStateKey, stateJSON ) ;
} ;

LocalStorageManager.prototype.clearGameState = function() {
  this.storage.removeItem( this.gameStateKey ) ;
} ;

LocalStorageManager.prototype.undoGameState = function() {
  // Get game state from local storage
  var stateJSON = this.storage.getObj( this.gameStateKey ) ;
  // Convert to array
  if ( stateJSON ) {
    stateJSON = [].concat( stateJSON ) ;
  } else {
    stateJSON = [] ;
  } ;
  // Check if there are enough states to do an undo
  if ( stateJSON.length > 1 ) {
    // Remove the first item
    stateJSON.pop() ;
  } ;
  // Save the truncated array
  this.storage.setObj( this.gameStateKey, stateJSON ) ;
} ;
