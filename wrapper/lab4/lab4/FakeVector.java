import java.util.Iterator;

/**
 * 
 * @author Ying
 * @CWID 10431247
 */

public class FakeVector {
	public static void main(String[] args) {
		 AList<Integer> t = new AList<>();
		 Iterator<Integer> iterator = t.iterator();
		 while(iterator.hasNext()) {
			 System.out.println(iterator.next());
		 }
	}
}

class AList<T> implements Vector<T> {

	private T[] array = null;
	private int size = 0;

	@SuppressWarnings("unchecked")
	public AList() {
		this.size = 0;
		array = (T[]) new Object[1];
	}

	@Override
	public T get(int n) throws NullPointerException {
		// TODO Auto-generated method stub
		if (n >= size || n < 0)
			throw new NullPointerException();

		return array[n];
	}

	@Override
	public void push(T t) {
		// TODO Auto-generated method stub
		if (size + 1 > array.length) {
			
			@SuppressWarnings("unchecked")
			T[] newArray = (T[]) new Object[array.length * 2];
			System.arraycopy(array, 0, newArray, 0, array.length);
			array = newArray;
		}

		array[size++] = t;
	}

	@Override
	public void set(int n, T v) throws NullPointerException {
		// TODO Auto-generate)d method stub
		if (n >= size || n < 0)
			throw new NullPointerException();
		array[n] = v;

	}

	@Override
	public int length() {
		// TODO Auto-generated method stub

		return size;

	}

	@SuppressWarnings("unchecked")
	@Override
	public void insert(int n, T v) throws NullPointerException {
		// TODO Auto-generated method stub
		if (n >= size || n < 0)
			throw new NullPointerException();
		if (size + 1 > array.length) {
			
			T[] newArray = (T[]) new Object[array.length * 2];
			System.arraycopy(array, 0, newArray, 0, n + 1);
			newArray[n + 1] = v;
			System.arraycopy(array, n + 1, newArray, n + 2, array.length - n - 1);
			array = newArray;
		}
		else {
			for(int i = size - 1; i > n; i --) 
				array[i + 1] = array[i];
			array[n + 1] = v;
		}
	}

	@Override
	public T pop() throws NullPointerException {
		// TODO Auto-generated method stub
		if (size == 0)
			throw new NullPointerException();
		size--;
		return array[size];

	}
	
	
	@SuppressWarnings("hiding")
	private class FakeVectorItr<T> implements Iterator<T>{
		private int cursor = 0;
		
		public FakeVectorItr(int index) {
			// TODO Auto-generated constructor stub
			this.cursor =index;
		}
		
		@Override
		public boolean hasNext() {
			// TODO Auto-generated method stub
			return this.cursor < size;
		}

		@Override
		public T next() {
			// TODO Auto-generated method stub
			if(this.hasNext()) {
				return (T)array[cursor ++];
			}else {
				return null;
			}
		}
		
	}

	@Override
	public Iterator<T> iterator() {
		// TODO Auto-generated method stub
		return new FakeVectorItr<T>(0);
	}

}

interface Vector<T> extends Iterable<T>{

	public T get(int n) throws NullPointerException;

	public void push(T t);

	public void set(int n, T v) throws NullPointerException;

	public int length();

	public T pop() throws NullPointerException;

	public void insert(int n, T v) throws NullPointerException;
}