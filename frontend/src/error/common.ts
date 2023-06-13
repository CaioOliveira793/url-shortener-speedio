export interface ResourceLocation {
	path: string | null;
	key: string;
	resource_type: string;
}

export interface InvalidDataIssue {
	message: string;
	path: string | null;
	type: DataIssueType;
}

export const enum DataIssueType {
	InvalidContent = 'invalid_content',
	InvalidType = 'invalid_type',
	InvalidLiteral = 'invalid_literal',
	Custom = 'custom',
	InvalidUnion = 'invalid_union',
	InvalidUnionDiscriminator = 'invalid_union_discriminator',
	InvalidEnumValue = 'invalid_enum_value',
	UnrecognizedKeys = 'unrecognized_keys',
	InvalidArguments = 'invalid_arguments',
	InvalidReturnType = 'invalid_return_type',
	InvalidDate = 'invalid_date',
	InvalidString = 'invalid_string',
	TooSmall = 'too_small',
	TooBig = 'too_big',
	InvalidIntersectionTypes = 'invalid_intersection_types',
	NotMultipleOf = 'not_multiple_of',
	NotFinite = 'not_finite',
}

export interface ApiError {
	status: number;
	message: string;
	error:
		| 'VALIDATION'
		| 'RESOURCE_ALREADY_EXISTS'
		| 'NOT_FOUND'
		| 'CONFLICT'
		| 'AUTHENTICATION'
		| 'UNAUTHORIZED'
		| 'FORBIDDEN'
		| string;
}
