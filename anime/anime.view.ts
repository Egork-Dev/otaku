namespace $.$$ {

	export class $otaku_app_card extends $mol_schema_record({
		name: $mol_schema_string,
		russian: $mol_schema_string,
		url: $mol_schema_string,
		image: $mol_schema_record({
			original: $mol_schema_string,
		}),
		score: $mol_schema_string,
		episodes: $mol_schema_integer,
		aired_on: $mol_schema_maybe( $mol_schema_string ),
		released_on: $mol_schema_maybe( $mol_schema_string ),
		description: $mol_schema_maybe( $mol_schema_string ),
		genres: $mol_schema_list( $mol_schema_record({
			russian: $mol_schema_string,
		}) ),
	}) {}


	export class $otaku_anime extends $.$otaku_anime {

		@ $mol_mem
		card() {
			const json = this.$.$mol_fetch.json( `${ this.api() }/api/animes/${ this.anime_id() }` )
			return $otaku_app_card.guard( json )
		}

		title() {
			return this.card().russian || this.card().name
		}

		shikimori_uri() {
			return this.api() + this.card().url
		}

		poster() {
			return this.api() + this.card().image.original
		}

		score() {
			return this.card().score
		}

		episodes() {
			return this.card().episodes
		}

		aired() {
			return [ this.card().aired_on, this.card().released_on ].filter( Boolean ).join( ' — ' )
		}

		genres() {
			return this.card().genres.map( genre => this.Genre( genre.russian ) )
		}

		genre_title( name: string ) {
			return name
		}

		description() {
			return this.card().description?.replace( /\[\/?\w+(=[^\]]*)?\]/g, '' ) ?? ''
		}

	}

}
