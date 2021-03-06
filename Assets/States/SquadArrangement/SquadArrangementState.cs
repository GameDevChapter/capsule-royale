// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.37
// 

using Colyseus.Schema;

namespace CapsuleRoyale.SquadArrangement {
	public class SquadArrangementState : Schema {
		[Type(0, "map", typeof(MapSchema<SquadMember>))]
		public MapSchema<SquadMember> members = new MapSchema<SquadMember>();

		[Type(1, "string")]
		public string owner = "";

		[Type(2, "boolean")]
		public bool readyToStart = false;

		[Type(3, "boolean")]
		public bool started = false;
	}
}
