package stringVectorisation;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class JS implements Metric<String> {

	private int charValUpb;
	private Map<String, SparseProbabilityArray> memoTable;
	private static double log2 = Math.log(2);

	private static double h(double d) {
		return -d * Math.log(d);
	}

	private static double hCalc(double d1, double d2) {
		assert d1 != 0;
		assert d2 != 0;
		return h(d1) + h(d2) - h(d1 + d2);
	}

	private static class SparseProbabilityArray {
		/*
		 * used to build up the structure event by event, counting cardinalities
		 */
		private Map<Integer, Integer> cardMap;
		private int acc;
		/*
		 * once finalised, these are populated in order with probabilities that add to
		 * ones
		 */
		private float[] finalProbs;
		private int[] finalEvents;

		public SparseProbabilityArray() {
			this.cardMap = new TreeMap<>();
			this.acc = 0;
		}

		@SuppressWarnings("boxing")
		public void addEvent(int event, int card) {
			if (!this.cardMap.keySet().contains(event)) {
				this.cardMap.put(event, 0);
			}
			this.cardMap.put(event, this.cardMap.get(event) + card);
			this.acc += card;
		}

		@SuppressWarnings("boxing")
		public void finalise() {
			final int size = this.cardMap.size();
			this.finalEvents = new int[size];
			this.finalProbs = new float[size];

			int ptr = 0;
			for (int event : this.cardMap.keySet()) {
				this.finalEvents[ptr] = event;
				this.finalProbs[ptr++] = (float) this.cardMap.get(event) / this.acc;
			}
			this.cardMap = null;
		}

		@SuppressWarnings("synthetic-access")
		public static float distance(SparseProbabilityArray ar1, SparseProbabilityArray ar2) {
			int ar1Ptr = 0;
			int ar2Ptr = 0;
			int ar1Event = ar1.finalEvents[ar1Ptr];
			int ar2Event = ar2.finalEvents[ar2Ptr];

			boolean finished = false;
			double simAcc = 0;
			while (!finished) {
				// System.out.println(ar1Event + ";" + ar2Event);
				if (ar1Event == ar2Event) {
					simAcc += hCalc(ar1.finalProbs[ar1Ptr], ar2.finalProbs[ar2Ptr]);
					ar1Ptr++;
					ar2Ptr++;
				} else if (ar1Event < ar2Event) {
					ar1Ptr++;
				} else {
					ar2Ptr++;
				}
				if (ar1Ptr == ar1.finalEvents.length) {
					ar1Event = Integer.MAX_VALUE;
				} else {
					ar1Event = ar1.finalEvents[ar1Ptr];
				}
				if (ar2Ptr == ar2.finalEvents.length) {
					ar2Event = Integer.MAX_VALUE;
				} else {
					ar2Event = ar2.finalEvents[ar2Ptr];
				}
				finished = ar1Ptr == ar1.finalEvents.length && ar2Ptr == ar2.finalEvents.length;
			}
			// simAcc can go over 2log2 because of rounding errors, not possible
			// mathematically; would cause return of NaN
			double k = Math.max(0, (1 - (simAcc / log2) / 2));
			return (float) Math.sqrt(k);
		}
	}

	/**
	 * @param maxCharVal
	 */
	public JS(int maxCharVal) {
		if (maxCharVal > Math.sqrt(Integer.MAX_VALUE)) {
			throw new RuntimeException("char val too large for SED");
		}
		this.charValUpb = maxCharVal + 1;
		this.memoTable = new HashMap<>();
	}

	private SparseProbabilityArray stringToSparseArray(String s) {
		if (this.memoTable.containsKey(s)) {
			return this.memoTable.get(s);
		} else {
			SparseProbabilityArray spa = new SparseProbabilityArray();

			for (int i = -1; i < s.length(); i++) {
				char ch1 = 0;
				char ch2 = 0;
				try {
					ch1 = s.charAt(i);
					spa.addEvent(ch1, 2);
					if (ch1 > this.charValUpb || ch1 == 0) {
						throw new RuntimeException("incorrect char val in SED");
					}
					ch2 = s.charAt(i + 1);
				} catch (IndexOutOfBoundsException e) {
					if (i == -1) {
						ch1 = 1;
						ch2 = s.charAt(0);
					} else {
						// ch1 = s.charAt(i); //redundant
						ch2 = 1;
					}
				}

				spa.addEvent(ch1 * this.charValUpb + ch2, 1);
			}
			spa.finalise();
			this.memoTable.put(s, spa);
			return spa;
		}
	}

	@Override
	public double distance(String x, String y) {
		SparseProbabilityArray s1 = stringToSparseArray(x);
		SparseProbabilityArray s2 = stringToSparseArray(y);
		return SparseProbabilityArray.distance(s1, s2);
	}

	@Override
	public String getMetricName() {
		return "sed";
	}

	public static void main(String[] a) {
		JS sed = new JS(255);
		System.out.println(sed.distance("zoroastrian", "zoo"));
	}

}
