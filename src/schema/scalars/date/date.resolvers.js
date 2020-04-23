import {GraphQLScalarType, Kind} from 'graphql';
import {GraphQLDate, GraphQLDateTime} from 'graphql-iso-date';
import {isTimeFormatValid} from '~utils/format-validations';

const timeConfig = {
	name: 'Time',
	serialize(value) {
		if (isTimeFormatValid(value)) {
			return value;
		}

		throw new TypeError(
			`Time must represent a valid HH:MM:SS time-string from 00:00:00 to 23:59:59. Value received: ’${String(value)}’.`
		);
	},
	parseValue(value) {
		if (isTimeFormatValid(value)) {
			return value;
		}

		throw new TypeError(
			`Time must represent a valid HH:MM:SS time-string from ’00:00:00’ to ’23:59:59’. Value received: ’${String(value)}’.`
		);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			throw new TypeError(
				`Time cannot represent non String type. Value received: ${String(ast.value)}`
			);
		}

		const {value} = ast;
		if (isTimeFormatValid(value)) {
			return value;
		}

		throw new TypeError(
			`Time must represent a valid HH:MM:SS time-string from ’00:00:00’ to ’23:59:59’. Value received: ’${String(value)}’.`
		);
	}
};

export default {
	Date: GraphQLDate,
	Time: new GraphQLScalarType(timeConfig),
	DateTime: GraphQLDateTime
};
