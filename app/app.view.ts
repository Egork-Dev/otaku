namespace $.$$ {

	export class $otaku_app_brief extends $mol_schema_record({
		id: $mol_schema_integer,
		name: $mol_schema_string,
		russian: $mol_schema_string,
		image: $mol_schema_record({
			preview: $mol_schema_string,
		}),
	}) {}

	export class $otaku_app extends $.$otaku_app {

		query( next?: string ) {
			return this.$.$mol_state_arg.value( 'search', next ) ?? ''
		}

		mode( next?: string ) {
			return this.$.$mol_state_arg.value( 'mode', next ) || 'catalog'
		}

		statuses( next?: Record< string, string > ): Record< string, string > {
			return this.$.$mol_state_local.value( 'otaku_statuses', next ) ?? {}
		}

		status( id: string, next?: string ) {
			const { [ id ]: prev = '', ... rest } = this.statuses()
			if( next === undefined ) return prev
			this.statuses( next ? { ... rest, [ id ]: next } : rest )
			return next
		}

		@ $mol_mem
		marked_ids() {
			return Object.keys( this.statuses() )
		}

		@ $mol_mem
		found() {
			const query = this.query()
			if( query ) this.$.$mol_wait_timeout( 400 )
			if( this.mode() !== 'list' ) return this.search( query, [] )
			return this.marked_ids().length ? this.search( query, this.marked_ids() ) : []
		}

		search( query: string, ids: readonly string[] ) {
			const json = this.$.$mol_fetch.json( `${ this.api() }/api/animes?order=popularity&limit=50&search=${ encodeURIComponent( query ) }&ids=${ ids }` )
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

		poster( id: string ) {
			return this.api() + this.brief( id ).image.preview
		}

		anime_id( id: string ) {
			return id
		}

	}

}
