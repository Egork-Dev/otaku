namespace $.$$ {

	export class $otaku_app_brief extends $mol_schema_record({
		id: $mol_schema_integer,
		name: $mol_schema_string,
		russian: $mol_schema_string,
	}) {}

	export class $otaku_app extends $.$otaku_app {

		query( next?: string ) {
			return this.$.$mol_state_arg.value( 'search', next ) ?? ''
		}

		@ $mol_mem
		found() {
			const query = this.query()
			if( query ) this.$.$mol_wait_timeout( 400 )
			return this.search( query )
		}

		search( query: string ) {
			const json = this.$.$mol_fetch.json( `${ this.api() }/api/animes?order=popularity&limit=50&search=${ encodeURIComponent( query ) }` )
			return $mol_schema_list( $otaku_app_brief ).guard( json )
		}

		@ $mol_mem
		spread_ids() {
			return this.found().map( anime => String( anime.id ) )
		}

		brief( id: string ) {
			return this.found().find( anime => String( anime.id ) === id )!
		}

		spread_title( id: string ) {
			return this.brief( id ).russian || this.brief( id ).name
		}

		anime_id( id: string ) {
			return id
		}

	}

}
